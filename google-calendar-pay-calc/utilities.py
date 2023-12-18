from settings import PaySettings
from typing import Union, Dict
from math import ceil, floor 


class FinancialUtilities:
    """
    Class encapsulating static utility functions involving calculating pay and taxes.
    """
    # Tax Withheld Information
    tax_table = {
            359: [0, 0],
            438: [0.19, 68.3462],
            548: [0.29, 112.1942],
            721: [0.2190, 68.3465],
            865: [0.2190, 74.8369],
            1282: [0.3477, 186.2119],
            2307: [0.345, 182.7504]
        }
    help_debt_table = {
        990.99: 0,
        1143.99: 0.01,
        1212.99: 0.02,
        1285.99: 0.25,
        1362.99: 0.03,
    }



    @staticmethod
    def calculate_pay(self, frequency_mult: int) -> dict[str, Union[int, float]]:
        """
        Calculates the total pay from the shifts worked in the fortnight. Calls on 'calculate_tax()' to
        obtain pay after-tax.
        :return: ['net_income': int, 'tax': int]
        """
        pay = PaySettings.get_pay_table()
        total_income = pay['ordinary'] * self.hours['ordinary'] + \
                       self.hours['sunday'] * pay['sunday'] + \
                       self.hours['saturday'] * pay['saturday'] + \
                       self.hours['evening'] * pay['evening'] + \
                       self.hours['publicHoliday'] * pay['publicHoliday']
        return FinancialUtilities.calculate_tax(total_income, frequency_mult)

    @classmethod
    def calculate_tax(cls, income: Union[float, int], frequency_mult: int) -> Dict[str, Union[int ,float]]:
        """
        Calculates the tax withheld and income after tax
        :param: income
        :return: tuple where (tax withheld, income after tax)
        """
        # Australian Tax Table for 2022-2023
        
        weekly_income = income / frequency_mult

        # calculating coefficients for different income brackets
        if weekly_income < 359:
            a, b = cls.tax_table[359]
        elif weekly_income < 438:
            a, b = cls.tax_table[438]
        elif weekly_income < 548:
            a, b = cls.tax_table[548]
        elif weekly_income < 721:
            a, b = cls.tax_table[721]
        elif weekly_income < 865:
            a, b = cls.tax_table[865]
        elif weekly_income < 1282:
            a, b = cls.tax_table[1282]
        elif weekly_income < 2307:
            a, b = cls.tax_table[2307]
        # tax withheld in a fortnight
        tax_withheld = round((a * (weekly_income + 0.99) - b) * frequency_mult)

        help_debt = 0
        for range in cls.help_debt_table:
            if weekly_income < range:
                help_debt = floor(cls.help_debt_table[range] * weekly_income)
                break


        return {'tax': tax_withheld, 'net_income': round(income - tax_withheld - help_debt, 2), 'help_debt': help_debt}
