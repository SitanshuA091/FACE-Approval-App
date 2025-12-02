import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_SHEETS_CREDENTIALS_PATH = os.getenv("GOOGLE_SHEETS_CREDENTIALS_PATH", "credentials/google_sheets_creds.json")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
ENROLLMENT_SHEET_NAME = os.getenv("ENROLLMENT_SHEET_NAME", "Enrollments")
ATTENDANCE_SHEET_NAME = os.getenv("ATTENDANCE_SHEET_NAME", "Attendance")

FACE_MODEL_PATH = os.getenv("FACE_MODEL_PATH", "data/face_model.yml")
LABELS_PATH = os.getenv("LABELS_PATH", "data/labels.pkl")
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "data/uploads")
CONFIDENCE_THRESHOLD = int(os.getenv("CONFIDENCE_THRESHOLD", "70"))

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

if not SPREADSHEET_ID:
    raise ValueError("SPREADSHEET_ID must be set in .env file")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(FACE_MODEL_PATH), exist_ok=True)
os.makedirs(os.path.dirname(LABELS_PATH), exist_ok=True)