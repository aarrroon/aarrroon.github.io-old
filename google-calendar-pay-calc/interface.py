from project import *
from tkinter import *


# Global Variable
calendar = Calendar()


# Update Google Calendar
def update_googcal_ui(payslip):
    global console_display
    if payslip:
        output = calendar.update_payslip(Payslip(payslip))
    else:
        # choose the payslip
        # TODO call another function
        output = calendar.update_payslip(None)
    console_display.configure(text=output)


# Add shift to the Google Calendar
def add_shifts_to_gc_ui():
    add_shift_window = Toplevel()
    shifts_to_add = []

    # header
    Label(add_shift_window, text="Add a Shift").grid(row=0, columnspan=2)
    # add text-fields
    date_label = Label(add_shift_window, text="Date (YYYY-MM-DD) ")
    date_entry = Entry(add_shift_window, width=30)

    start_time_label = Label(add_shift_window, text="Start Time (HHMM)")
    start_time_entry = Entry(add_shift_window, width=30)

    duration_label = Label(add_shift_window, text="Duration (H)")
    duration_entry = Entry(add_shift_window, width=30)

    def add_shift():
        date_shift = date_entry.get()
        start = start_time_entry.get()
        duration = duration_entry.get()
        shift_string = f"{date_shift}, {start}, {duration}"
        shift_event = calendar.validate_shift(shift_string)
        if shift_event:
            shifts_to_add.append(shift_event)
            display_start = shift_event.start.strftime("%Y-%m-%d - %A from %H%M to ")
            display_end = shift_event.end.strftime("%H%M\n")
            og_text = shift_display.cget("text")
            shift_display.config(text=og_text + display_start + display_end)

    def finalise_add_shift(shifts: List[Event]):
        # Add shifts to calendar
        for event in shifts:
            calendar.google_calendar.add_event(event)
        add_shift_window.destroy()
        console_display.config(text="Shifts added!")

    # button
    add_btn = Button(add_shift_window, text="Add Shift", command=add_shift)
    finish_btn = Button(add_shift_window, text="Finished", command=lambda: finalise_add_shift(shifts_to_add))

    # display console
    add_console_frame = LabelFrame(add_shift_window)
    add_console_frame.grid(row=5, columnspan=3, sticky=N + W + S + E, padx=10, pady=10)
    shift_display = Label(add_console_frame)
    shift_display.grid()

    # pack onto screen
    date_label.grid(row=1, column=0)
    date_entry.grid(row=1, column=1, columnspan=2)

    start_time_label.grid(row=2, column=0)
    start_time_entry.grid(row=2, column=1, columnspan=2)

    duration_label.grid(row=3, column=0)
    duration_entry.grid(row=3, column=1, columnspan=2)

    add_btn.grid(row=4, column=1)
    finish_btn.grid(row=4, column=2)


def choose_payslip(function_to_do):
    payslip_window = Toplevel(width=50)
    payslip_window.geometry("300x300")
    chosen_payslip_index = IntVar()
    payslip_list = calendar.list_payslip_dates()

    # obtaining current payslip
    current_payslip = calendar.find_current_payslip_date()

    # displaying options
    for index, payslip in enumerate(payslip_list):
        current = ""
        if payslip == current_payslip:
            current = " (current)"
        radiobutton = Radiobutton(payslip_window, text=payslip + current, variable=chosen_payslip_index, value=index)
        radiobutton.grid(row=index, column=0, sticky='w')

    def use_payslip():
        payslip_window.destroy()
        chosen_payslip = payslip_list[chosen_payslip_index.get()]
        function_to_do(chosen_payslip)

    # creating submit button
    choose_btn = Button(payslip_window, text="Choose Payslip", command=use_payslip)
    choose_btn.grid(row=len(payslip_list))


def open_tax_window():
    tax_window = Toplevel()
    # header
    Label(tax_window, text="Add a Shift").grid(row=0, columnspan=2)

    # add text-fields
    income_label = Label(tax_window, text="Gross Income: ")
    income_entry = Entry(tax_window, width=30)

    def calculate_tax():
        gross_income = int(income_entry.get())
        aft_tax_inc = FinancialUtilities.calculate_tax(gross_income)
        display = f"Net Income: ${aft_tax_inc['net_income']}; Tax: ${aft_tax_inc['tax']}"
        income_display.config(text=display)

    # buttons
    calculate_btn = Button(tax_window, text="Calculate Tax", command=calculate_tax)
    finish_btn = Button(tax_window, text="Finished", command=tax_window.destroy)

    # display console
    tax_console_frame = LabelFrame(tax_window)
    tax_console_frame.grid(row=3, columnspan=3, sticky=N + W + S + E, padx=10, pady=10)

    income_display = Label(tax_console_frame)
    income_display.grid()

    # Packing
    income_label.grid(row=1, column=0)
    income_entry.grid(row=1, column=1, columnspan=2)
    calculate_btn.grid(row=2, column=1)
    finish_btn.grid(row=2, column=2)


#
def view_details(chosen_payslip):
    payslip = Payslip(chosen_payslip)
    output = ""
    output += payslip.print_shifts()
    output += payslip.print_pay()
    console_display.config(text=output)


# Create the GUI of the application
def create_template():
    # Header
    root = Tk()
    root.title('Title')
    root.iconbitmap('')
    # Change default size of window
    root.geometry("600x600")

    # Creating Widgets
    # header
    header = Label(root, text="Google Calendar Pay Calculator!")
    # buttons
    button1 = Button(root, text="View the shifts and details of a payslip", padx=5, pady=5, command=lambda: choose_payslip(view_details))
    button2 = Button(root, text="Update a payslip on the Google Calendar", padx=5, pady=5,
                     command=lambda: choose_payslip(update_googcal_ui))
    button3 = Button(root, text="Update the last, current and the next 2 payslips", padx=5, pady=5,
                     command=lambda: update_googcal_ui(None))
    button4 = Button(root, text="Add a shift to the Google Calendar", padx=5, pady=5, command=add_shifts_to_gc_ui)
    button5 = Button(root, text="Calculate tax withheld of a fortnightly amount", padx=5, pady=5, command=open_tax_window)
    button6 = Button(root, text="Exit", padx=5, pady=5, command=root.destroy)
    console_frame = LabelFrame(root, text="Console", padx=5, pady=5)
    global console_display
    console_display = Label(console_frame)

    # Pack
    header.grid(row=0, column=0, columnspan=2)
    button1.grid(row=1, column=0, sticky=N + S + E + W, padx=5, pady=5)
    button2.grid(row=2, column=0, sticky=N + S + E + W, padx=5, pady=5)
    button3.grid(row=3, column=0, sticky=N + S + E + W, padx=5, pady=5)
    button4.grid(row=1, column=1, sticky=N + S + E + W, padx=5, pady=5)
    button5.grid(row=2, column=1, sticky=N + S + E + W, padx=5, pady=5)
    button6.grid(row=3, column=1, sticky=N + S + E + W, padx=5, pady=5)
    console_frame.grid(rowspan=5, columnspan=2, padx=5, pady=5, sticky=N + W + E + S)
    console_display.pack()

    root.mainloop()


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
    create_template()

