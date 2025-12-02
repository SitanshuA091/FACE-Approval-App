# 🎭 FaceApproval - AI Attendance System

> A facial recognition attendance system demo built with React, FastAPI, and OpenCV LBPH.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![React](https://img.shields.io/badge/React-18.2-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688)

---

## ✨ Features

- 📸 **Dual Enrollment** - Webcam or file upload
- 🔍 **Real-time Recognition** - Automatic attendance marking
- 📊 **Live Dashboard** - Stats and records
- ☁️ **Google Sheets** - Auto data sync
- 📱 **Responsive** - Works on all devices

---

## 🛠️ Tech Stack

**Frontend:** React, Tailwind CSS, React Webcam  
**Backend:** FastAPI, OpenCV (LBPH), Google Sheets API  
**Algorithm:** LBPH (Local Binary Patterns Histograms)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 16+
- Google Sheets API credentials

### Setup

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Configure .env with Google Sheets credentials
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

**Access:** http://localhost:3000

---

## 📱 Usage

1. **Enroll** - Capture or upload face photo
2. **Approve Entry** - Face camera for recognition
3. **Dashboard** - View attendance stats

---

## 📁 Structure
```
├── backend/          # FastAPI + OpenCV
│   ├── app/
│   ├── data/
│   └── credentials/
└── frontend/         # React UI
    └── src/
```

---

## 🔧 API Endpoints

- `POST /api/enroll/webcam` - Enroll from camera
- `POST /api/enroll/file` - Enroll from file
- `POST /api/approve` - Mark attendance
- `GET /api/dashboard/stats` - Get statistics

**API Docs:** http://localhost:8000/docs

---

## 🤖 How It Works

Uses **LBPH algorithm** for face recognition:
- Detects faces with Haar Cascade
- Extracts texture patterns
- Trains on each enrollment
- Recognizes faces in real-time

---

## 👨‍💻 Author

**Sitanshu Anmol** @ Yadu Public School 2025

---

## 📄 License

MIT License

---

<p align="center">⭐ Demo project for educational purposes</p>
