from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import base64
from datetime import datetime
from app import config
from app.face_service import face_service
from app.sheets_service import sheets_service

app = FastAPI(title="FaceApproval API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EnrollWebcamRequest(BaseModel):
    name: str
    image: str  # Base64 encoded image

class ApproveEntryRequest(BaseModel):
    image: str  # Base64 encoded image

class EnrollResponse(BaseModel):
    success: bool
    message: str
    name: str

class ApproveResponse(BaseModel):
    success: bool
    message: str
    name: str = None
    confidence: float = None

class DashboardStats(BaseModel):
    total_enrolled: int
    today_present: int
    today_absent: int
    absent_users: list

def decode_base64_image(base64_string: str) -> np.ndarray:
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_bytes = base64.b64decode(base64_string)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "FaceApproval API is running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "enrolled_users": face_service.get_enrolled_count()
    }

@app.post("/api/enroll/webcam", response_model=EnrollResponse)
async def enroll_from_webcam(request: EnrollWebcamRequest):
    try:
        if not request.name or len(request.name.strip()) == 0:
            raise HTTPException(status_code=400, detail="Name is required")
        
        name = request.name.strip()
        
        image = decode_base64_image(request.image)
        
        success = face_service.enroll_face(image, name)
        
        if not success:
            return EnrollResponse(
                success=False,
                message="No face detected in image. Please try again.",
                name=name
            )
        

        sheets_service.add_enrollment(name)
        
        return EnrollResponse(
            success=True,
            message=f"Successfully enrolled {name}",
            name=name
        )
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/enroll/file", response_model=EnrollResponse)
async def enroll_from_file(
    name: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        if not name or len(name.strip()) == 0:
            raise HTTPException(status_code=400, detail="Name is required")
        
        name = name.strip()
        
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image file")
        
        success = face_service.enroll_face(image, name)
        
        if not success:
            return EnrollResponse(
                success=False,
                message="No face detected in image. Please try again.",
                name=name
            )
        
        sheets_service.add_enrollment(name)
        
        return EnrollResponse(
            success=True,
            message=f"Successfully enrolled {name}",
            name=name
        )
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/approve", response_model=ApproveResponse)
async def approve_entry(request: ApproveEntryRequest):
    try:
        image = decode_base64_image(request.image)
        
        name, confidence = face_service.recognize_face(image)
        
        if name is None:
            return ApproveResponse(
                success=False,
                message="Face not recognized. Please enroll first.",
                confidence=confidence
            )
        
        sheets_service.add_attendance(name, "Present")
        
        return ApproveResponse(
            success=True,
            message=f"Entry approved. Welcome, {name}!",
            name=name,
            confidence=float(confidence)
        )
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    try:
        all_enrolled = sheets_service.get_all_enrollments()
        today_present = sheets_service.get_today_attendance()
        absent_users = sheets_service.get_absent_users()
        
        return DashboardStats(
            total_enrolled=len(all_enrolled),
            today_present=len(today_present),
            today_absent=len(absent_users),
            absent_users=absent_users
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/attendance")
def get_attendance_records():
    try:
        records = sheets_service.get_attendance_records()
        return {"records": records}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users")
def get_enrolled_users():
    try:
        users = face_service.get_enrolled_names()
        return {"users": users, "count": len(users)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)