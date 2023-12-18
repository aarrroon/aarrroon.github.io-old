import os
import yaml
from typing import Dict


class PaySettings:
    # Class variables
    payslip_frequency = None
    event_name = None
    pay_table = {}

    evening_rate_start = None
    evening_rate_flag = None
    saturday_rate_flag = None
    sunday_rate_flag = None

    # def evening_rates_allowed(self):
    #     return self.evening_rate_flag
    
    # def saturday_rates_allowed(self):
    #     return self.saturday_rate_flag

    # def sunday_rates_allowed(self):
    #     return self.sunday_rate_flag
    
    @classmethod
    def name(cls):
        return cls.event_name
    
    @classmethod
    def frequency(cls):
        frequency_table = {
            "weekly": 1,
            "fortnightly": 2,
            "monthly": 4
        }
        return frequency_table[cls.payslip_frequency]
    
    @classmethod
    def save_settings(cls, event_name: str, payslip_frequency: str, pay_table: Dict[str, int]):
        name_data = {'event_name': event_name}
        frequency_data = {'payslip_frequency': payslip_frequency}
        # save to yaml file
        with open('settings.yaml', 'w') as file:
            yaml.dump(name_data, file)
            yaml.dump(pay_table, file)
            yaml.dump(frequency_data, file)
        cls.load_settings()
    
    @classmethod
    def load_settings(cls):
        with open('settings.yaml', 'r') as file:
            loaded_settings = yaml.safe_load(file)
            cls.payslip_frequency = loaded_settings['payslip_frequency']
            cls.event_name = loaded_settings['event_name']
            for hourly_type in ('evening', 'ordinary', 'publicHoliday', 'saturday', 'sunday'):
                cls.pay_table[hourly_type] = loaded_settings[hourly_type]

    @classmethod
    def get_pay_table(cls):
        return cls.pay_table
    
    @classmethod
    def settings_exist(cls):
        file_name = 'settings'
        return os.path.isfile(file_name) and file_name.lower().endswith('.yaml')

