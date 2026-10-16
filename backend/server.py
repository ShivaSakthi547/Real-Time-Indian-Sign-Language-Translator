import os
import sys
import time
import math
import base64
import cv2
import numpy as np
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

# Add project src to sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
SRC_DIR = os.path.join(PROJECT_ROOT, "real-time-sign-language-translator-main", "src")
if SRC_DIR not in sys.path:
    sys.path.insert(0, SRC_DIR)

import mediapipe as mp
from detector import GestureDetector
from config import (
    SIGN_TRANSLATIONS,
    LANGUAGES,
    DEFAULT_LANGUAGE,
    MIN_DETECTION_CONFIDENCE,
    MIN_TRACKING_CONFIDENCE,
    MAX_NUM_HANDS
)
from evaluation_data import evaluation_store

app = FastAPI(
    title="SignBridge Recognition & Translation Engine",
    description="Backend API powering real-time hand gesture recognition and multilingual translation.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize MediaPipe Hands
# static_image_mode=True ensures MediaPipe runs palm detection on EVERY frame
# min_detection_confidence=0.42 provides balanced sensitivity to detect both hands without false positives
mp_hands = mp.solutions.hands
hands_detector = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=MAX_NUM_HANDS,
    model_complexity=1,
    min_detection_confidence=0.42,
    min_tracking_confidence=0.42
)
gesture_detector = GestureDetector()
gesture_detector.required_frames = 3

# Gesture Metadata dictionary for UI library
GESTURE_DETAILS: Dict[str, Dict[str, Any]] = {
    "HELLO": {
        "meaning": "Standard friendly greeting",
        "category": "Social",
        "hands": 1,
        "description": "Open palm facing forward with all 5 fingers extended upward and apart.",
        "rule": "Thumb, index, middle, ring, and pinky are all extended beyond their respective PIP joints."
    },
    "STOP": {
        "meaning": "Halt, pause, or warning",
        "category": "Commands",
        "hands": 1,
        "description": "Fist / closed palm with fingers curled tightly into the palm.",
        "rule": "All 5 fingers are retracted (wrist-to-tip distance is shorter than wrist-to-PIP)."
    },
    "THANK YOU": {
        "meaning": "Expressing gratitude or appreciation",
        "category": "Social",
        "hands": 2,
        "description": "Two open hands brought together near the chest with palms facing inward or together (Namaste gesture).",
        "rule": "Two hands detected with open fingers and wrists positioned close together horizontally."
    },
    "YES": {
        "meaning": "Affirmation, agreement, or confirmation",
        "category": "Responses",
        "hands": 1,
        "description": "Thumbs-up gesture with the thumb extended upward and all other four fingers curled tightly.",
        "rule": "Thumb tip extended vertically above CMC joint while index, middle, ring, and pinky remain closed."
    },
    "NO": {
        "meaning": "Negation, disagreement, or decline",
        "category": "Responses",
        "hands": 1,
        "description": "Thumbs-down gesture with thumb extended downward and four fingers curled into the fist.",
        "rule": "Thumb tip pointing downward (y-coordinate greater than wrist) with remaining fingers folded."
    },
    "PLEASE": {
        "meaning": "Polite request or appeal",
        "category": "Social",
        "hands": 1,
        "description": "Pinched hand with tips of the index, middle, and ring fingers touching or close to the thumb tip.",
        "rule": "Small Euclidean distance between thumb tip and index/middle finger tips."
    },
    "FRIEND": {
        "meaning": "Companion, buddy, or camaraderie",
        "category": "Social",
        "hands": 1,
        "description": "V-sign / Peace sign: Index and middle fingers extended upward and separated, other fingers folded.",
        "rule": "Index and middle extended while ring and pinky are curled into the palm."
    },
    "EAT": {
        "meaning": "Food, dining, or consuming a meal",
        "category": "Actions",
        "hands": 1,
        "description": "Three fingers (thumb, index, and middle) extended and clustered upwards towards the mouth.",
        "rule": "Thumb, index, and middle fingers extended with ring and pinky closed."
    },
    "DRINK": {
        "meaning": "Beverage, water, or thirst",
        "category": "Actions",
        "hands": 1,
        "description": "Hand forming a C-shape or small pinch holding an imaginary cup brought near the mouth.",
        "rule": "Thumb and index finger open forming curved cup grip while other fingers are folded."
    },
    "HELP": {
        "meaning": "Assistance needed, emergency, or support",
        "category": "Commands",
        "hands": 2,
        "description": "Two open hands extended side-by-side with palms facing forward.",
        "rule": "Two hands detected simultaneously, both with 5 open fingers held apart."
    }
}


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "project": "SignBridge — AI-Powered Sign Language Communication Assistant",
        "engine": "MediaPipe Solutions Hands + Geometric Classifier",
        "mediapipe_version": getattr(mp, "__version__", "0.10.x"),
        "supported_gestures_count": len(SIGN_TRANSLATIONS),
        "supported_languages_count": len(LANGUAGES)
    }


@app.get("/api/gestures")
def get_gestures():
    result = []
    for gesture, meta in GESTURE_DETAILS.items():
        translations = SIGN_TRANSLATIONS.get(gesture, {})
        result.append({
            "id": gesture,
            "label": gesture,
            "meaning": meta["meaning"],
            "category": meta["category"],
            "hands": meta["hands"],
            "description": meta["description"],
            "rule": meta["rule"],
            "translations": translations
        })
    return result


@app.get("/api/languages")
def get_languages():
    native_names = {
        "en": "English",
        "hi": "हिन्दी (Hindi)",
        "te": "తెలుగు (Telugu)",
        "ta": "தமிழ் (Tamil)",
        "ml": "മലയാളം (Malayalam)",
        "kn": "ಕನ್ನಡ (Kannada)",
        "bn": "বাংলা (Bengali)"
    }
    return [
        {
            "code": code,
            "name": name,
            "native_name": native_names.get(code, name)
        }
        for code, name in LANGUAGES.items()
    ]


@app.get("/api/evaluation/summary")
def get_evaluation_summary():
    return evaluation_store.calculate_summary()


@app.get("/api/evaluation/trials")
def get_evaluation_trials():
    return evaluation_store.get_trials()


@app.get("/api/evaluation/export-csv")
def export_evaluation_csv():
    csv_data = evaluation_store.export_csv()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=signbridge_evaluation_results.csv"}
    )


class LogTrialRequest(BaseModel):
    intended_gesture: str
    predicted_gesture: str
    confidence: float
    is_correct: bool
    lighting: Optional[str] = "Live Webcam Session"
    camera: Optional[str] = "Browser Video Stream"
    latency_ms: Optional[float] = 30.0


@app.post("/api/evaluation/log")
def log_trial(req: LogTrialRequest):
    trial = {
        "Intended_Gesture": req.intended_gesture,
        "Predicted_Gesture": req.predicted_gesture,
        "Confidence": req.confidence,
        "Is_Correct": req.is_correct,
        "Lighting": req.lighting,
        "Camera": req.camera,
        "Latency_ms": req.latency_ms
    }
    evaluation_store.add_trial(trial)
    return {"status": "success", "message": "Trial logged successfully", "total_trials": len(evaluation_store.trials)}


class TTSRequest(BaseModel):
    text: str
    language: str = "en"


@app.post("/api/tts")
def generate_tts(req: TTSRequest):
    try:
        from gtts import gTTS
        import tempfile
        import io

        fp = io.BytesIO()
        tts = gTTS(text=req.text, lang=req.language, slow=False)
        tts.write_to_fp(fp)
        fp.seek(0)
        audio_b64 = base64.b64encode(fp.read()).decode("utf-8")
        return {"status": "success", "audio_base64": audio_b64, "mime_type": "audio/mp3"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws/recognize")
async def websocket_recognize(websocket: WebSocket):
    await websocket.accept()
    prev_time = time.time()
    detector = GestureDetector()
    detector.required_frames = 3

    try:
        while True:
            data = await websocket.receive_json()
            t0 = time.time()
            image_data = data.get("image")
            target_lang = data.get("language", DEFAULT_LANGUAGE)

            if not image_data:
                await websocket.send_json({"error": "No image data provided"})
                continue

            # Decode base64
            if "," in image_data:
                image_data = image_data.split(",", 1)[1]

            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                await websocket.send_json({"error": "Failed to decode frame"})
                continue

            # Convert to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            rgb_frame.flags.writeable = False
            results = hands_detector.process(rgb_frame)

            detected_hands = []
            landmarks_payload = []

            if results.multi_hand_landmarks:
                for hand_lms in results.multi_hand_landmarks:
                    detected_hands.append(hand_lms.landmark)
                    landmarks_payload.append([
                        {"x": round(lm.x, 4), "y": round(lm.y, 4), "z": round(lm.z, 4)}
                        for lm in hand_lms.landmark
                    ])

            # Classify using connection detector
            detected_sign = detector.detect(detected_hands)

            # Fresh frame evaluation: clear immediately when no stable gesture is held
            confidence = 0.0
            current_stable = None

            if detected_sign:
                stable_ratio = min(detector.candidate_frames / max(detector.required_frames, 1), 1.0)
                base_conf = 0.85 + (0.13 * stable_ratio)
                confidence = round(base_conf, 3)
                current_stable = detected_sign
            else:
                current_stable = None
                confidence = 0.0

            # Translation
            translation = ""
            if current_stable:
                translation = SIGN_TRANSLATIONS.get(current_stable, {}).get(target_lang, current_stable)

            t1 = time.time()
            latency_ms = round((t1 - t0) * 1000, 1)
            fps = round(1.0 / max(t1 - prev_time, 0.001), 1)
            prev_time = t1

            response_payload = {
                "detected": len(detected_hands) > 0,
                "hands_count": len(detected_hands),
                "gesture": current_stable,
                "confidence": confidence,
                "translation": translation,
                "language": target_lang,
                "language_name": LANGUAGES.get(target_lang, "English"),
                "stable_frames": detector.candidate_frames,
                "required_frames": detector.required_frames,
                "is_stable": (current_stable is not None),
                "landmarks": landmarks_payload,
                "latency_ms": latency_ms,
                "fps": min(fps, 60.0)
            }

            await websocket.send_json(response_payload)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"error": str(e)})
        except Exception:
            pass
