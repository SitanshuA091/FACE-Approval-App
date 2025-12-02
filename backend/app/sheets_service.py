from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime
from typing import List, Dict
from app import config

class SheetsService:
    def __init__(self):
        """Initialize Google Sheets service"""
        self.credentials = service_account.Credentials.from_service_account_file(
            config.GOOGLE_SHEETS_CREDENTIALS_PATH,
            scopes=['https://www.googleapis.com/auth/spreadsheets']
        )
        self.service = build('sheets', 'v4', credentials=self.credentials)
        self.spreadsheet_id = config.SPREADSHEET_ID
    
    def add_enrollment(self, name: str) -> bool:
        try:
            now = datetime.now()
            date_str = now.strftime("%Y-%m-%d")
            time_str = now.strftime("%H:%M:%S")
            
            values = [[name, date_str, time_str]]
            body = {'values': values}
            
            self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=f'{config.ENROLLMENT_SHEET_NAME}!A:C',
                valueInputOption='RAW',
                body=body
            ).execute()
            
            return True
        except Exception as e:
            print(f"Error adding enrollment: {e}")
            return False
    
    def add_attendance(self, name: str, status: str = "Present") -> bool:
        try:
            now = datetime.now()
            date_str = now.strftime("%Y-%m-%d")
            time_str = now.strftime("%H:%M:%S")
            
            values = [[name, date_str, time_str, status]]
            body = {'values': values}
            
            self.service.spreadsheets().values().append(
                spreadsheetId=self.spreadsheet_id,
                range=f'{config.ATTENDANCE_SHEET_NAME}!A:D',
                valueInputOption='RAW',
                body=body
            ).execute()
            
            return True
        except Exception as e:
            print(f"Error adding attendance: {e}")
            return False
    
    def get_all_enrollments(self) -> List[str]:
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f'{config.ENROLLMENT_SHEET_NAME}!A:A'
            ).execute()
            
            values = result.get('values', [])
            names = [row[0] for row in values[1:] if row]
            return names
        except Exception as e:
            print(f"Error getting enrollments: {e}")
            return []
    
    def get_attendance_records(self) -> List[Dict]:
        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=f'{config.ATTENDANCE_SHEET_NAME}!A:D'
            ).execute()
            
            values = result.get('values', [])
            if not values:
                return []
            

            records = []
            for row in values[1:]:
                if len(row) >= 4:
                    records.append({
                        'name': row[0],
                        'date': row[1],
                        'time': row[2],
                        'status': row[3]
                    })
            
            return records
        except Exception as e:
            print(f"Error getting attendance: {e}")
            return []
    
    def get_today_attendance(self) -> List[str]:
        try:
            today = datetime.now().strftime("%Y-%m-%d")
            all_records = self.get_attendance_records()
            
            today_names = set()
            for record in all_records:
                if record['date'] == today:
                    today_names.add(record['name'])
            
            return list(today_names)
        except Exception as e:
            print(f"Error getting today's attendance: {e}")
            return []
    
    def get_absent_users(self) -> List[str]:
        try:
            all_enrolled = self.get_all_enrollments()
            today_present = self.get_today_attendance()
            
            absent = [name for name in all_enrolled if name not in today_present]
            return absent
        except Exception as e:
            print(f"Error getting absent users: {e}")
            return []

sheets_service = SheetsService()