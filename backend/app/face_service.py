import cv2
import numpy as np
import pickle
import os
from typing import Optional, Tuple
from app import config

class FaceService:
    def __init__(self):
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        self.label_to_name = {}
        self.name_to_label = {}
        self.next_label = 0
        
        self.load_model()
    
    def load_model(self):
        try:
            if os.path.exists(config.LABELS_PATH):
                with open(config.LABELS_PATH, 'rb') as f:
                    data = pickle.load(f)
                    self.label_to_name = data['label_to_name']
                    self.name_to_label = data['name_to_label']
                    self.next_label = data['next_label']
                
                if os.path.exists(config.FACE_MODEL_PATH):
                    self.recognizer.read(config.FACE_MODEL_PATH)
                    print(f"Loaded model with {len(self.label_to_name)} users")
        except Exception as e:
            print(f"Error loading model: {e}")
    
    def save_model(self):
        """Save face model and labels"""
        try:
            with open(config.LABELS_PATH, 'wb') as f:
                pickle.dump({
                    'label_to_name': self.label_to_name,
                    'name_to_label': self.name_to_label,
                    'next_label': self.next_label
                }, f)
            
            self.recognizer.write(config.FACE_MODEL_PATH)
            print("Model saved successfully")
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def detect_face(self, image: np.ndarray) -> Optional[np.ndarray]:
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(100, 100)
            )
            
            if len(faces) == 0:
                return None
            
            faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
            x, y, w, h = faces[0]
            
            face = gray[y:y+h, x:x+w]
            face = cv2.resize(face, (200, 200))
            
            return face
        except Exception as e:
            print(f"Error detecting face: {e}")
            return None
    
    def enroll_face(self, image: np.ndarray, name: str) -> bool:
        try:
            face = self.detect_face(image)
            if face is None:
                return False
            
            if name in self.name_to_label:
                label = self.name_to_label[name]
            else:
                label = self.next_label
                self.label_to_name[label] = name
                self.name_to_label[name] = label
                self.next_label += 1
            
            faces = [face]
            labels = [label]
            
            
            self.recognizer.train(faces, np.array(labels))
            
            self.save_model()
            
            return True
        except Exception as e:
            print(f"Error enrolling face: {e}")
            return False
    
    def recognize_face(self, image: np.ndarray) -> Tuple[Optional[str], float]:
        try:
            if not self.label_to_name:
                return None, 0.0
            
            face = self.detect_face(image)
            if face is None:
                return None, 0.0
            
            label, confidence = self.recognizer.predict(face)
            

            if confidence < config.CONFIDENCE_THRESHOLD:
                name = self.label_to_name.get(label, None)
                return name, confidence
            
            return None, confidence
        except Exception as e:
            print(f"Error recognizing face: {e}")
            return None, 0.0
    
    def get_enrolled_count(self) -> int:
        return len(self.label_to_name)
    
    def get_enrolled_names(self) -> list:
        return list(self.name_to_label.keys())

face_service = FaceService()