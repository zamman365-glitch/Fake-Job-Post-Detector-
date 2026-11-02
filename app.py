import os
import logging
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("jobguard")

# Configurable Model Path
MODEL_PATH = os.getenv("MODEL_PATH", "fake_job_post_detector_model.pkl")
if not os.path.exists(MODEL_PATH):
    raise RuntimeError(
        f"CRITICAL STARTUP ERROR: Model file not found at path '{MODEL_PATH}'. "
        f"Please verify that the file exists or set the MODEL_PATH environment variable."
    )

try:
    model = joblib.load(MODEL_PATH)
    logger.info(f"Successfully loaded model from {MODEL_PATH}")
except Exception as e:
    raise RuntimeError(f"CRITICAL STARTUP ERROR: Failed to load model from '{MODEL_PATH}': {e}")

app = FastAPI(title="JobGuard API", description="Production API for Fake Job Post Detection")

# 1. CORS Configuration
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Authorization"],
)

# 2. Pydantic validation schema
class JobPost(BaseModel):
    title: str = Field(..., min_length=1, max_length=300, description="Job title, non-empty")
    company_profile: str = Field(default="", max_length=20000, description="Company profile overview")
    description: str = Field(default="", max_length=20000, description="Job post description")
    requirements: str = Field(default="", max_length=20000, description="Role requirements")
    
    employment_type: str = Field(default="Unknown", max_length=100)
    required_experience: str = Field(default="Unknown", max_length=100)
    required_education: str = Field(default="Unknown", max_length=100)
    
    telecommuting: int = Field(..., ge=0, le=1, description="1 if telecommuting, else 0")
    has_company_logo: int = Field(..., ge=0, le=1, description="1 if company logo present, else 0")
    has_questions: int = Field(..., ge=0, le=1, description="1 if screening questions present, else 0")

# 4. Health Check Endpoint
@app.get("/health")
def health():
    return {"status": "ok"}

# 3 & 4. Prediction Endpoint with error handling & dual key response
@app.post("/predict")
def predict(job: JobPost):
    try:
        text = f"{job.title} {job.company_profile} {job.description} {job.requirements}"
        row = pd.DataFrame([{
            'text': text,
            'employment_type': job.employment_type,
            'required_experience': job.required_experience,
            'required_education': job.required_education,
            'telecommuting': job.telecommuting,
            'has_company_logo': job.has_company_logo,
            'has_questions': job.has_questions
        }])
        
        probabilities = model.predict_proba(row)[0]
        # Class 1 is fraudulent job posting
        prob = float(probabilities[1])
        is_fraud = int(prob > 0.5)
        
        # Dual-key response for backwards and forward compatibility
        return {
            "fradulent": is_fraud,
            "fraudulent": is_fraud,
            "pobability": round(prob, 2),
            "probability": round(prob, 4)
        }
    except Exception as exc:
        logger.error(f"Prediction failed: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Prediction failed due to an internal model error."
        )

# 5. Static files & SPA fallback serving
FRONTEND_DIST = os.path.join(os.path.dirname(__file__), "frontend", "dist")

if os.path.exists(FRONTEND_DIST) and os.path.isdir(FRONTEND_DIST):
    # Mount assets directory if present
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # SPA Fallback for client-side routing (/scan, /dashboard, etc.)
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        target_file = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(target_file):
            return FileResponse(target_file)
        # Fallback to SPA index.html
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.get("/")
    def home():
        if os.path.exists("index.html"):
            return FileResponse("index.html")
        return {"status": "JobGuard API running. Frontend dist not found."}