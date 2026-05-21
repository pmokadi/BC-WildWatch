# predict.py
# FastAPI server that runs our wildlife image classification model
# Receives an image, processes it and returns the animal prediction
#
# To run this server:
# /Users/pmokadi/bc-wildwatch/.venv/bin/python -m uvicorn predict:app --host 0.0.0.0 --port 5000 --reload

import io
import numpy as np
import tf_keras
from pathlib import Path
from contextlib import asynccontextmanager
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# TensorFlow wrapped in try/except in case it is not installed yet
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

# ─── File Paths ───────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent.parent
MODEL_PATH  = BASE_DIR / "my_model" / "keras_model.h5"
LABELS_PATH = BASE_DIR / "my_model" / "labels.txt"

# ─── Global Variables ─────────────────────────────────────────────
model  = None
labels = []

# ─── Load Model Function ──────────────────────────────────────────
def load_model():
    global model, labels

    if not TF_AVAILABLE:
        print("TensorFlow not installed. Run: pip install tensorflow")
        return

    if not MODEL_PATH.exists():
        print(f"Model not found at {MODEL_PATH}")
        return

    if not LABELS_PATH.exists():
        print(f"Labels not found at {LABELS_PATH}")
        return

    model = tf_keras.models.load_model(str(MODEL_PATH), compile=False)

    raw    = LABELS_PATH.read_text().strip().splitlines()
    labels = [line.split()[-1] for line in raw if line.strip()]

    print("Model loaded successfully")
    print(f"Labels: {labels}")

# ─── Lifespan ─────────────────────────────────────────────────────
# Runs load_model when the server starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield

# ─── App ──────────────────────────────────────────────────────────
app = FastAPI(
    title="BC WildWatch Predictor",
    description="Classifies campus wildlife images using a trained AI model",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)

# ─── Image Preparation ────────────────────────────────────────────
def prepare_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img, dtype=np.float32)
    arr = (arr / 127.5) - 1.0
    arr = np.expand_dims(arr, axis=0)
    return arr

# ─── Routes ───────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "labels": labels
    }

@app.post("/predict")
async def predict(image: UploadFile = File(...)):

    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Please upload an image file")

    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet")

    image_bytes = await image.read()
    tensor      = prepare_image(image_bytes)
    scores      = model.predict(tensor)[0]
    top_index   = int(np.argmax(scores))
    prediction  = labels[top_index]
    confidence  = f"{float(scores[top_index]) * 100:.1f}%"

    all_scores = {
        labels[i]: round(float(scores[i]), 4)
        for i in range(len(scores))
    }

    return {
        "prediction": prediction,
        "confidence": confidence,
        "all_scores": all_scores
    }