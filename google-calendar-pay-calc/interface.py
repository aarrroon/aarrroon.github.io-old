from project import *
from tkinter import *
from tkinter import Tk, font
import customtkinter

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
    customtkinter.CTkLabel(add_shift_window, text="Add a Shift", font=("Garamond", 30)).grid(row=0, columnspan=2)
    # add text-fields
    date_label = customtkinter.CTkLabel(add_shift_window, text="Date (YYYY-MM-DD) ", padx=5, pady=5)
    date_entry = customtkinter.CTkEntry(add_shift_window, width=150)

    start_time_label = customtkinter.CTkLabel(add_shift_window, text="Start Time (HHMM)", padx=5, pady=5)
    start_time_entry = customtkinter.CTkEntry(add_shift_window, width=150)

    duration_label = customtkinter.CTkLabel(add_shift_window, text="Duration (H)", padx=5, pady=5)
    duration_entry = customtkinter.CTkEntry(add_shift_window, width=150)

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
            shift_display.configure(text=og_text + display_start + display_end)

    def finalise_add_shift(shifts: List[Event]):
        # Add shifts to calendar
        for event in shifts:
            calendar.google_calendar.add_event(event)
        add_shift_window.destroy()
        console_display.configure(text="Shifts added!")

    # button
    add_btn = customtkinter.CTkButton(add_shift_window, text="Add Shift", command=add_shift)
    finish_btn = customtkinter.CTkButton(add_shift_window, text="Finished", command=lambda: finalise_add_shift(shifts_to_add))

    # display console
    add_console_frame = customtkinter.CTkFrame(add_shift_window)
    add_console_frame.grid(row=5, columnspan=3, sticky=N + W + S + E, padx=10, pady=10)
    shift_display = customtkinter.CTkLabel(add_console_frame, text="", padx=10, pady=10)
    shift_display.grid()

    # pack onto screen
    date_label.grid(row=1, column=0, padx=10, pady=10)
    date_entry.grid(row=1, column=1, columnspan=2, padx=10, pady=10)

    start_time_label.grid(row=2, column=0, padx=10, pady=10)
    start_time_entry.grid(row=2, column=1, columnspan=2, padx=10, pady=10)

    duration_label.grid(row=3, column=0, padx=10, pady=10)
    duration_entry.grid(row=3, column=1, columnspan=2, padx=10, pady=10)

    add_btn.grid(row=4, column=1, padx=10, pady=10)
    finish_btn.grid(row=4, column=2, padx=10, pady=10)


def choose_payslip(function_to_do):
    payslip_window = Toplevel(width=50)
    payslip_window.geometry("400x550")
    chosen_payslip_index = IntVar()
    payslip_list = calendar.list_payslip_dates()

    # obtaining current payslip
    current_payslip = calendar.find_current_payslip_date()

    # displaying options
    for index, payslip in enumerate(payslip_list):
        current = ""
        if payslip == current_payslip:
            current = " (current)"
        radiobutton = customtkinter.CTkRadioButton(payslip_window, text=payslip + current, variable=chosen_payslip_index, value=index)
        radiobutton.grid(row=index, column=0, sticky='w', padx=10, pady=5)

    def use_payslip():
        payslip_window.destroy()
        chosen_payslip = payslip_list[chosen_payslip_index.get()]
        function_to_do(chosen_payslip)

    # creating submit button
    choose_btn = customtkinter.CTkButton(payslip_window, text="Choose Payslip", command=use_payslip)
    choose_btn.grid(row=len(payslip_list), padx=5, pady=5)


def open_tax_window():
    tax_window = Toplevel()
    # header
    customtkinter.CTkLabel(tax_window, text="Add a Shift").grid(row=0, columnspan=2)

    # add text-fields
    income_label = customtkinter.CTkLabel(tax_window, text="Gross Income: ")
    income_entry = customtkinter.CTkEntry(tax_window, width=30)

    def calculate_tax():
        gross_income = int(income_entry.get())
        aft_tax_inc = FinancialUtilities.calculate_tax(gross_income)
        display = f"Net Income: ${aft_tax_inc['net_income']}; Tax: ${aft_tax_inc['tax']}"
        income_display.configure(text=display)

    # buttons
    calculate_btn = customtkinter.CTkButton(tax_window, text="Calculate Tax", command=calculate_tax)
    finish_btn = customtkinter.CTkButton(tax_window, text="Finished", command=tax_window.destroy)

    # display console
    tax_console_frame = customtkinter.CTkLabelFrame(tax_window)
    tax_console_frame.grid(row=3, columnspan=3, sticky=N + W + S + E, padx=10, pady=10)

    income_display = customtkinter.CTkLabel(tax_console_frame)
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
    console_display.configure(text=output)


# Create the GUI of the application
def create_template():
    # Header
    root = customtkinter.CTk()
    root.title('Google Calendar Pay Calculator')
    root.iconbitmap('icon.ico')
    # Change default size of window
    root.geometry("660x600")
    # Custom UI Settings
    customtkinter.set_appearance_mode("Light")  # Modes: "System" (standard), "Dark", "Light"
    customtkinter.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"

    # Creating a Font object of "TkDefaultFont"
    defaultFont = font.nametofont("TkDefaultFont")

    # Overriding default-font with custom settings
    # i.e changing font-family, size and weight
    defaultFont.configure(family="San Francisco", size=9)

    # Creating Widgets
    # header
    header = customtkinter.CTkLabel(root, text="Google Calendar Pay Calculator!", font=("Garamond bold", 30), padx=20, pady=20, )
    # buttons
    button1 = customtkinter.CTkButton(root, text="View the shifts and details of a payslip", command=lambda: choose_payslip(view_details))
    button2 = customtkinter.CTkButton(root, text="Update a payslip on the Google Calendar", 
                     command=lambda: choose_payslip(update_googcal_ui))
    button3 = customtkinter.CTkButton(root, text="Update the last, current and the next 2 payslips", 
                     command=lambda: update_googcal_ui(None))
    button4 = customtkinter.CTkButton(root, text="Add a shift to the Google Calendar",  command=add_shifts_to_gc_ui)
    button5 = customtkinter.CTkButton(root, text="Calculate tax withheld of a fortnightly amount",  command=open_tax_window)
    button6 = customtkinter.CTkButton(root, text="Exit",  command=root.destroy)
    label1 = customtkinter.CTkLabel(root, text="Display", font=("Garamond", 25), padx=10, pady=10)
    console_frame = customtkinter.CTkFrame(root)
    global console_display
    console_display = customtkinter.CTkLabel(console_frame, text="", padx=10, pady=10, height=340)

    # Pack
    header.grid(row=0, column=0, columnspan=2)
    button1.grid(row=1, column=0, sticky=N + S + E + W, padx=20, pady=5)
    button2.grid(row=2, column=0, sticky=N + S + E + W, padx=20, pady=5)
    button3.grid(row=3, column=0, sticky=N + S + E + W, padx=20, pady=5)
    button4.grid(row=1, column=1, sticky=N + S + E + W, padx=20, pady=5)
    button5.grid(row=2, column=1, sticky=N + S + E + W, padx=20, pady=5)
    button6.grid(row=3, column=1, sticky=N + S + E + W, padx=20, pady=5)
    console_frame.grid(rowspan=5, columnspan=2,  sticky=N + W + E + S, row=5, padx=10, pady=10)
    label1.grid(row=4, columnspan=2)
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

