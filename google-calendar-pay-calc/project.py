import holidays
import re
import argparse
import sys


from gcsa.google_calendar import GoogleCalendar
from gcsa.event import Event
from typing import Union, List, Tuple, Dict
from datetime import datetime, timedelta, date


from utilities import FinancialUtilities
from settings import PaySettings

"""
External Packages:
- holidays
- Google Calendar Simple API (gcsa)
- PyYaml

Built-in Packages:
- datetime
- math
- re
- parser
- sys

"""
"""
Weekday - $187.50
Close - $205
Saturday - $225
Sunday - $270

"""

class Payslip:
    """
    Class representing a payslip, which contains information about the shifts within one, the number of hours worked
    the end date and the pay information.
    """
    def __init__(self, end_date: str) -> None:
        """
        Constructor.
        :param end_date: the last day of a payslip, to distinguish it from other payslips.
        """
        self.end_date = end_date
        # The shifts worked that is included in this payslip
        self.shifts = self.add_shifts()
        # The different hours and respective loading e.g. Saturday hours or ordinary hours
        self.hours = self.extract_hours()
        # The gross income and tax as a tupple
        self.pay = FinancialUtilities.calculate_pay(self, PaySettings.frequency())
        
        
    def extract_hours(self) -> Dict[str, int]:
        """
        Returns the different hours worked in a payslip.
        May include:
            - public holiday hours
            - Saturday hours
            - Sunday hours
            - evening hours
            - ordinary hours
        :return: dictionary of different hours worked
        """
        # output
        payslip_hours = {
            'ordinary': 0,
            'saturday': 0,
            'sunday': 0,
            'evening': 0,
            'publicHoliday': 0
        }
        # obtain current year
        curr_year = datetime.now().year
        # get a list of holidays for this year
        holidays_list = holidays.country_holidays('AU', subdiv='VIC', years=curr_year, expand=False)
        # for each shift, categorise how many hours was worked
        for shift in self.shifts:
            # calculate how long the shift was
            duration = shift.end - shift.start
            seconds_in_hour = 60 * 60
            shift_hours = duration.total_seconds() / seconds_in_hour
            # if shift includes unpaid lunch break
            if shift_hours >= 7:
                shift_hours -= 1

            # when evening pay starts
            evening_pay_time = datetime(shift.end.year, shift.end.month, shift.end.day, hour=18,
                                        tzinfo=shift.end.tzinfo)

            # if shift is during public holiday
            if shift.end.date() in holidays_list:
                payslip_hours['publicHoliday'] += shift_hours
            # if shift is on Saturday
            elif shift.end.date().weekday() == 5:
                payslip_hours['saturday'] += shift_hours
            # if shift is on Sunday
            elif shift.end.date().weekday() == 6:
                payslip_hours['sunday'] += shift_hours
            # if shift is in the evening on a weekday
            elif shift.end.hour > evening_pay_time.hour >= shift.start.hour:
                payslip_hours['evening'] += (shift.end - evening_pay_time).total_seconds() / seconds_in_hour
                payslip_hours['ordinary'] += (evening_pay_time - shift.start).total_seconds() / seconds_in_hour
                # if shift is longer than 5 hours, subtract 0.5 hours from evening pay
                if shift_hours > 5:
                    payslip_hours['evening'] -= 0.5

            # else if shift is the basic pay
            else:
                payslip_hours['ordinary'] += shift_hours
        return payslip_hours

    def print_pay(self):
        """
        Prints the hours worked, number of shifts and gross income of this payslip.
        :return: ['net_income': int, 'tax': int]
        """

        output = f"""This is for the payslip ending on {self.end_date} 
            \nHours: {self.hours}
            \nThe number of shifts worked this payslip is: {len(self.shifts)} 
            \nGross Income: ${self.pay['net_income']:02} and Tax is ${self.pay['tax']}.00
            """
        return output

    def add_shifts(self):
        """
        Allocates shifts to the payslip by searching the calendar
        :return:
        """
        frequency_mult = PaySettings.frequency()
        period = timedelta(days=7*frequency_mult)
        end_date = datetime.fromisoformat(self.end_date)
        start_date = end_date + timedelta(days=1) - period

        google_calendar = GoogleCalendar(credentials_path='credentials.json')
        events_in_week = google_calendar.get_events(start_date, end_date + timedelta(days=1), order_by='updated')
        # updates shift attribute in Payslip
        return [event for event in events_in_week if event.summary == PaySettings.name()]

    def print_shifts(self) -> None:
        """
        ConsoleDisplays a sorted list of shifts in a list of date-times.
        :param: shifts: list of Events
        :return: display of individual shifts and details
        """
        output = []
        for shift in self.shifts:
            start_time = f"{shift.start.hour}:{shift.start.minute:02}"
            end_time = f"{shift.end.hour}:{shift.end.minute:02}"
            shift_date = shift.start.date().isoformat()
            days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            output.append([f"{shift_date} - {start_time} to {end_time} on a {days_of_week[shift.start.weekday()]}",
                           datetime.timestamp(shift.start)])
        output.sort(key=lambda x: x[1])  # sort based on the second element in each array
        result = ""
        for shift in output:
            result += f'{shift[0]}\n'
        return result

class Calendar:
    """
    Class representing a Calendar. Can list out appropriate payslip dates and finding the payslip in the current period.

    """
    def __init__(self):
        """
        Constructor
        """
        # Load settings
        PaySettings.load_settings()
        # Google Calendar using the API
        self.google_calendar = GoogleCalendar(credentials_path='credentials.json')
        # List of significant payslips
        self.payslip_dates = self.list_payslip_dates()

    def list_payslip_dates(self, base_date_temp = "2023-05-14") -> List[str]:
        """
        List the last day of each pay cycle.
        :param: base_date_temp: the dates a fortnight from this
        :return:
        """
        base = date.fromisoformat(base_date_temp)
        today = date.today()
        frequency_mult = PaySettings.frequency()
        # scaling the base to 1 payslip behind today
        while (today - base).days > (14 * frequency_mult):
            base += timedelta(days = 7 * frequency_mult)

        output = []
        for i in range(10):
            interval = timedelta(days= 7 * frequency_mult * i)
            output.append((base + interval).isoformat())
        return output

    def find_current_payslip_date(self) -> str:
        """
        Finds the period the current period is a part of.
        :return: a string representing the date of the end of the current payslip
        """
        today = date.today()

        for possible_date in self.payslip_dates:
            if (date.fromisoformat(possible_date) - today).total_seconds() >= 0:
                return possible_date

    def get_selected_payslip_index(self, index: int) -> str:
        """
        Returns the payslip end-date using a given index
        :param index: index in the list of payslip end-dates displayed
        :return: end-date at chosen index
        """
        return self.payslip_dates[index]

    @staticmethod
    def get_payslip(end_date: str) -> Payslip:
        """
        Returns a payslip with a provided end date
        :param end_date: end date of the payslip that is being obtained
        :return: Payslip that ends on a specific date
        """
        # TODO maybe add a check
        return Payslip(end_date)

    def update_payslip(self, payslip_index: Union[int, str]) -> List[Tuple[str, str]]:
        """
        Returns a list of Google Calendar event IDs as used by the API. By default, returns the ID of the previous,
        current and the next two payslips. If the parameter specific date is used, then it will provide a list with
        a singular date.
        :param specific_date: used if we want to return the Google Calendar event ID of a particular payslip
        :return: list of event IDs pertaining to the 'PAY' event
        """
        output = []

        if payslip_index.lower() == 'a':
            payslip_dates = self.payslip_dates[0:7]  
        elif payslip_index == '':
            payslip_dates = [self.find_current_payslip_date()]
        elif match := re.search(r"^((\d{4})-(\d{2})-(\d{2}))$", payslip_index):
            payslip_dates = [match.group(1)]
        else:
            payslip_dates = [self.payslip_dates[int(payslip_index)]]
        
        # loop through each payslip date
        for date_string in payslip_dates:
            paydate_obj = date.fromisoformat(date_string) + timedelta(days=3)
            
            # create updated payslip event name
            payslip = Payslip(date_string)
            amount = "{:.2f}".format(payslip.pay['net_income'])
            event_name = f'Pay: ${amount}'

            # search calendar for already made event 
            search_result = list(self.google_calendar.get_events(paydate_obj, paydate_obj + timedelta(days=1), query='Pay'))
            
            # if there is no payslip event already
            if len(search_result) == 0:
                # create a payslip event
                event = Event(event_name, start=paydate_obj, end=paydate_obj)
                # add to google calendar
                self.google_calendar.add_event(event)
            # if there is payslip event already created + needs updating
            elif search_result[0].summary != event_name: 
                search_result[0].summary = event_name
                self.google_calendar.update_event(search_result[0])
            output.append(f'\n{paydate_obj.isoformat()} - {event_name}')
        return output


    def add_calendar_shifts(self, get_shift_to_add) -> str:
        """
        Adds shifts to the Google Calendar
        :return:
        """
        shifts_to_add = []
        while True:
            user_input = get_shift_to_add()
            if user_input.lower() == 'n':
                break
            shift_event = self.validate_shift(user_input)
            if shift_event:
                shifts_to_add.append(shift_event)
            print(shift_event)

        # Confirm shifts are correct
        if not shifts_to_add:
            print('No valid shifts were inputted')

        # Add shifts to calendar
        for event in shifts_to_add:
            self.google_calendar.add_event(event)

        return f"Number of shifts added is {len(shifts_to_add)}"

    @staticmethod
    def validate_shift(shift_string: str) -> Union[Event, None]:
        if match := re.search(r"^(\d{4})-(\d{2})-(\d{2}), (\d\d)(\d\d), (\d)$", shift_string):
            shift_year, shift_month, shift_day = int(match.group(1)), int(match.group(2)), int(match.group(3))
            shift_hour, shift_min, shift_length = int(match.group(4)), int(match.group(5)), int(match.group(6))
            start_time = datetime(shift_year, shift_month, shift_day, hour=shift_hour, minute=shift_min)
            end_time = start_time + timedelta(hours=shift_length)
            event = Event("NAB", start=start_time, end=end_time)
            return event
        return None

class Application:
    """
    Encapsulates any interaction between the program and the user.
    """

    def __init__(self, calendar: Calendar) -> None:
        # Arguments provided in the command line by the user
        self.args = self.obtain_args()
        # Calendar
        self.google_calendar = calendar
        # The chosen payslip by the user
        self.selected_payslip = None
        
    def obtain_args(self) -> argparse.Namespace:
        """
        Obtains the arguments from the user.
        :return: parse for the command-line arguments
        """
        # Obtaining arguments
        parser = argparse.ArgumentParser()
        parser.add_argument('--details', action='store_true')
        parser.add_argument('--add', action='store_true')
        parser.add_argument('--update', action='store_true')
        return parser.parse_args()

    def run(self, calendar: Calendar) -> None:
        """
        Used to operate the entire program
        :param calendar: calendar used
        :return: doesn't return anything
        """
        # Check if there's no arguments, then get user inputs
        if len(sys.argv) != 1:
            self.check_args()
        else:
            ui = ConsoleDisplay()
            while True:
                action = ui.choose_action()
                if action not in (2, 3, 4, 6):
                    payslip = ui.choose_selected_payslip(calendar)
                elif action == 2:
                    ConsoleDisplay().display_payslips(calendar)
                    payslip = input("Select payslip using their index or input 'A' to update all payslips \n")
                match action:
                    # view details of a payslip
                    case 1:
                        ConsoleDisplay.println(payslip.print_shifts())
                        ConsoleDisplay.println(payslip.print_pay())
                    # update a payslip
                    case 2:
                        ConsoleDisplay.print_list(calendar.update_payslip(payslip))
                    # add shift to Google Calendar
                    case 3:
                        calendar.add_calendar_shifts(ConsoleDisplay.get_shift_to_add)
                    case 4:
                        gross_income = float(input("What is the pay to calculate tax on?\n"))
                        frequency = PaySettings.frequency()
                        income = FinancialUtilities.calculate_tax(gross_income, frequency)
                        ConsoleDisplay.println(f"Net Income: ${income['net_income']}; Tax: ${income['tax']}, HELP Debt: ${income['help_debt']}")
                    case 6:
                        sys.exit()
                # choose what action to perform

    def check_args(self) -> None:
        """
        Performs different actions depending on the arguments
        :return: nothing
        """
        # Add shifts to calendar
        if self.args.add:
            pass
            # add_calendar_shifts()
        # Print shifts
        if self.args.details:
            self.payslip().print_shifts()
            self.payslip().print_pay()

        if self.args.update:
            events_list = self.calendar.return_pay_event_id()
            self.calendar.update_paydate_gc(events_list)

    def payslip(self) -> Payslip:
        """
        Getter for the payslip of the selected end date
        :return: selected payslip
        """
        return Payslip(self.selected_payslip)



class ConsoleDisplay:
    """
    Class encapsulating methods involved in displaying instructions to the user and as a menu interface
    """
    def choose_action(self) -> int:
        """
        Select what action the user wants to perform.
        :return: integer representing what actions to perform
        """
        # Ask what the user wants to do
        while True:
            information_message = (
                "************************************************\n"
                "Select what you want to do (e.g. 1) \n"
                "1: View the shifts and details of a payslip \n"
                "2: Update a payslip on the Google Calendar \n"
                "3: Add a shift to the Google Calendar \n"
                "4: Calculate tax withheld of a fortnightly amount \n"
                "6: Exit \n"
            )
            try:
                return int(input(information_message))
            except ValueError:
                print('Input should be an integer')

    def display_payslips(self, calendar: Calendar) -> None:
        """
        ConsoleDisplay the suggest options of different payslips
        :param calendar: instance of the Calendar class
        :return: nothing
        """
        payslip_dates = calendar.list_payslip_dates()
        print('************************************************')
        # ConsoleDisplay options
        for index, end_date in enumerate(payslip_dates):
            print(f"{index}: {end_date}")

    def choose_selected_payslip(self, calendar: Calendar) -> Payslip:
        """
        Obtain which payslip the user wants to inspect/use
        :param calendar: instance of Calendar
        :return: provides the Payslip instance that the user requests
        """
        # ConsoleDisplay options to user
        self.display_payslips(calendar)

        # Obtain user selection
        while True:
            # Ask the user which payslip
            date_input = input(
                "Input an index selection or payslip date in the format YYYY-MM-DD (leave empty to use current payslip)\n")
            # If in the date formatting
            if match := re.search(r"^((\d{4})-(\d{2})-(\d{2}))$", date_input):
                return Payslip(match.group(1))
            # Leaving empty for the current payslip
            elif date_input == "":
                return Payslip(calendar.find_current_payslip_date())
            # Using indices
            elif int(date_input) >= 0:
                end_date = calendar.get_selected_payslip_index(int(date_input))
                return Payslip(end_date)

    @staticmethod
    def get_shift_to_add():
        return input('Input date, start time and duration like: "YYYY-MM-DD, HHMM, 8" (or 9:00AM) ["n" if done]\n')
    @staticmethod
    def println(string: str) -> None:
        print(string)

    def print_list(list: List[str]) -> None:
        for s in list:
            print(s)

if __name__ == '__main__':
    """
    --shifts:
        displays the shifts in a fortnight

    --add:
        add shifts into the calendar

    --update:
        update the pay onto calendar

    --pay or leave empty:

    """
    app = Application(Calendar())
    app.run(app.google_calendar)
