import holidays
import re
import argparse
import sys

from gcsa.google_calendar import GoogleCalendar
from gcsa.event import Event
from typing import Union, List, Tuple, Dict
from math import ceil
from datetime import datetime, timedelta, date

"""
External Packages:
- holidays
- Google Calendar Simple API (gcsa)
-
Built-in Packages:
- datetime
- math
- re
- parser
"""
"""
Weekday - $187.50
Close - $205
Saturday - $225
Sunday - $270

"""


"""
TODO: change the structure of everything needing to contain a Calendar instance.
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
        self.pay = FinancialUtilities.calculate_pay(self)

    def extract_hours(self) -> Dict[str, int]:
        """
        Returns the different hours worked in a payslip.
        Includes:
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
        curr_year = datetime.now().year
        # get a list of holidays
        holidays_list = holidays.country_holidays('AU', subdiv='VIC', years=curr_year, expand=False)
        # for each shift, categorise how many hours was worked
        for shift in self.shifts:
            # calculate how long the shift was
            duration = shift.end - shift.start
            seconds_in_hour = 60 * 60
            shift_hours = duration.total_seconds() / seconds_in_hour
            if shift_hours == 8:
                shift_hours = 7.5

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
            \nThe number of shifts worked this fortnight is: {len(self.shifts)} 
            \nGross Income: ${self.pay['net_income']:02} and Tax is ${self.pay['tax']}.00
            """
        return output

    def add_shifts(self):
        """
        Allocates shifts to the payslip by searching the calendar
        :return:
        """
        fortnight = timedelta(days=14)
        end_date = datetime.fromisoformat(self.end_date)
        start_date = end_date + timedelta(days=1) - fortnight

        google_calendar = GoogleCalendar(credentials_path='credentials.json')
        events_in_week = google_calendar.get_events(start_date, end_date + timedelta(days=1), order_by='updated')
        # updates shift attribute in Payslip
        return [event for event in events_in_week if event.summary == "IKEA"]

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

class FinancialUtilities:
    """
    Class encapsulating static utility functions involving calculating pay and taxes.
    """
    @staticmethod
    def calculate_pay(self) -> dict[str, Union[int, float]]:
        """
        Calculates the total pay from the shifts worked in the fortnight. Calls on 'calculate_tax()' to
        obtain pay after-tax.
        :return: ['net_income': int, 'tax': int]
        """
        pay = {
            'ordinary': 24.93,
            'sunday': 37.39,
            'saturday': 31.16,
            'evening': 31.16,
            'publicHoliday': 56.09
        }
        total_income = pay['ordinary'] * self.hours['ordinary'] + \
                       self.hours['sunday'] * pay['sunday'] + \
                       self.hours['saturday'] * pay['saturday'] + \
                       self.hours['evening'] * pay['evening'] + \
                       self.hours['publicHoliday'] * pay['publicHoliday']
        return FinancialUtilities.calculate_tax(total_income)

    @staticmethod
    def calculate_tax(fortnightly_income: float) -> Dict[str, Union[int ,float]]:
        """
        Calculates the tax withheld and income after tax
        :param fortnightly_income:
        :return: tuple where (tax withheld, income after tax)
        """
        # Australian Tax Table for 2022-2023
        a, b = 0, 0
        tax_table = {
            359: [0, 0],
            438: [0.19, 68.3462],
            548: [0.29, 112.1942],
            721: [0.21, 68.3465],
            865: [0.2190, 74.8369],
            1282: [0.3477, 186.2119],
            2307: [0.34, 182.7504]
        }
        weekly_income = fortnightly_income / 2

        # calculating coefficients for different income brackets
        if weekly_income < 359:
            a, b = tax_table[359]
        elif weekly_income < 438:
            a, b = tax_table[438]
        elif weekly_income < 548:
            a, b = tax_table[548]
        elif weekly_income < 721:
            a, b = tax_table[721]
        elif weekly_income < 865:
            a, b = tax_table[865]
        elif weekly_income < 1282:
            a, b = tax_table[1282]
        elif weekly_income < 2307:
            a, b = tax_table[2307]
        # tax withheld in a fortnight
        tax_withheld = ceil((a * weekly_income - b) * 2)
        return {'tax': tax_withheld, 'net_income': round(fortnightly_income - tax_withheld, 2)}


class Calendar:
    """
    Class representing a Calendar. Can list out appropriate payslip dates and finding the payslip in the current period.

    """
    def __init__(self):
        """
        Constructor
        """
        # Google Calendar using the API
        self.google_calendar = GoogleCalendar(credentials_path='credentials.json')
        # List of significant payslips
        self.payslip_dates = self.list_payslip_dates()

    def list_payslip_dates(self, base_date_temp = "2023-05-14") -> List[str]:
        """
        :param: base_date_temp: the dates a fortnight from this
        :return:
        """
        base = date.fromisoformat(base_date_temp)
        today = date.today()
        # scaling the base to 1 fortnight behind today
        while (today - base).days > 28:
            base += timedelta(days=14)

        output = []
        for i in range(10):
            interval = timedelta(days=14 * i)
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

    def return_pay_event_id(self, specific_date: str = None) -> List[Tuple[str, str]]:
        """
        Returns a list of Google Calendar event IDs as used by the API. By default, returns the ID of the previous,
        current and the next two payslips. If the parameter specific date is used, then it will provide a list with
        a singular date.
        :param specific_date: used if we want to return the Google Calendar event ID of a particular payslip
        :return: list of event IDs pertaining to the 'IKEA PAY' event
        """
        start_date = date.today() - timedelta(days=14)
        interval = timedelta(days=14 * 3)
        end_date = start_date + interval

        search_result = self.google_calendar.get_events(start_date, end_date, order_by='startTime', query='IKEA PAY',
                                                 single_events=True)

        # TODO check if we need this
        id_list = None
        if specific_date is None:
            id_list = [((event_id.start - timedelta(days=3)).isoformat(), event_id.id) for event_id in search_result]
        else:
            id_list = [((event_id.start - timedelta(days=3)).isoformat(), event_id.id) for event_id in search_result if
                       (event_id.start - timedelta(days=3)).isoformat() == specific_date]
        return id_list

    def update_paydate_gc(self, id_list: List[Tuple[str, str]]) -> None:
        """
        It updates the payslip events on Google Calendar based on the id_list provided as a parameter.
        By default, it updates one paycheck ago, the current paycheck, and the next 2 paychecks, however
        it may update only one specific payslip event depending on the return_pay_event_id.
        :param: id_list: list of ID's to update in the Google Calendar
        """
        output = ""
        for event in id_list:
            target_pay_event = self.google_calendar.get_event(event[1])
            target_payslip = (Payslip(event[0]))
            target_pay = target_payslip.pay['net_income']
            target_pay_event.summary = f'IKEA PAY - ${target_pay}'
            self.google_calendar.update_event(target_pay_event)
            output += f'Updated paydate on the {event[0]} to IKEA PAY - ${target_pay}!\n'
        return output

    def update_payslip(self, payslip: Payslip):
        if payslip is not None:
            enddate = payslip.end_date
        else:
            enddate = None
        id = self.return_pay_event_id(enddate)
        return self.update_paydate_gc(id)

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
            print('Shift is valid')
            shift_year, shift_month, shift_day = int(match.group(1)), int(match.group(2)), int(match.group(3))
            shift_hour, shift_min, shift_length = int(match.group(4)), int(match.group(5)), int(match.group(6))
            start_time = datetime(shift_year, shift_month, shift_day, hour=shift_hour, minute=shift_min)
            end_time = start_time + timedelta(hours=shift_length)
            event = Event('IKEA', start=start_time, end=end_time)
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
                if action not in (3, 4, 5):
                    payslip = ui.choose_selected_payslip(calendar)

                match action:
                    # view details of a payslip
                    case 1:
                        ConsoleDisplay.println(payslip.print_shifts())
                        ConsoleDisplay.println(payslip.print_pay())
                    # update a payslip
                    case 2:
                        calendar.update_payslip(payslip)
                    # update last, current and next 2 payslips
                    case 3:
                        ConsoleDisplay.println(calendar.update_payslip(None))
                    # add shift to Google Calendar
                    case 4:
                        calendar.add_calendar_shifts(ConsoleDisplay.get_shift_to_add)
                    case 5:
                        gross_income = int(input("What is the fortnightly pay?\n$"))
                        income = FinancialUtilities.calculate_tax(gross_income)
                        ConsoleDisplay.println(f"Net Income: ${income['tax']}; Tax: ${income['net_income']}!")
                    case 6:
                        break
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
                "3: Update the last, current and the next payslip \n"
                "4: Add a shift to the Google Calendar \n"
                "5: Calculate tax withheld of a fortnightly amount \n"
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
