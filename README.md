# JobGuard — Anti-Gravity Fake Job Post Detector

Production-quality machine learning application for detecting fraudulent job postings, featuring an engineered **Sharp** design aesthetic with anti-gravity 3D canvas physics, realtime reactive defense chambers, and a comprehensive telemetry dashboard.

---

## 🛡️ Architecture Overview

JobGuard consists of a high-performance **FastAPI** inference backend powering a supervised machine learning pipeline and a **React 18 + Vite** frontend.

```
├── app.py                             # FastAPI backend (CORS, validation, dual-key response, SPA fallback)
├── fake_job_post_detector_model.pkl   # Serialized scikit-learn ML pipeline
├── test_app.py                        # Smoke tests (pytest + FastAPI TestClient)
├── Dockerfile                         # Multi-stage production container (Node 20 -> Python 3.11)
├── requirements.txt                   # Backend dependencies (fastapi, uvicorn, scikit-learn==1.6.1, etc.)
└── frontend/                          # Vite + React 18 SPA
    ├── src/
    │   ├── api/client.js              # 15s timeout, typed { isFraud, probability }, dual-key tolerance
    │   ├── components/                # Button, Panel, Meter, KpiCard, ResultCard, Navbar
    │   ├── hooks/useScanHistory.js    # Client localStorage history with computed KPIs
    │   ├── pages/                     # Landing (/), Scanner (/scan), Dashboard (/dashboard)
    │   ├── three/                     # Anti-gravity Hero 3D scene & Reactive Shield chamber
    │   └── styles/index.css           # Global design system with CSS custom properties & clip paths
    └── vite.config.js                 # Proxy config and build setup
```

---

## 🎨 Visual Identity & Design System

JobGuard adheres strictly to a **SHARP** design language:
- **Zero Border-Radius**: `border-radius: 0px` globally.
- **Angular Cut Corners**: 14px angular cut-corners on cards, panels, and buttons (`clip-path: polygon(...)`).
- **Hairline Grid**: Subtle architectural 40px grid backdrop.
- **Semantic Colors**:
  - Genuine / Safe: `--forest-500: #1f7a4d` & `--forest-300: #4fb07f`
  - Fraud / Threat: `--crimson-500: #c1121f` & `--crimson-300: #e5484d`
  - Backgrounds: `--charcoal-950: #0b0d0c`, surfaces: `--charcoal-900: #131614`, borders: `--charcoal-700: #252a27`
- **Typography**: Display headings in **Space Grotesk**, body text in **IBM Plex Sans**, and telemetry in **JetBrains Mono**.

---

## 🚀 Quickstart Guide

### 1. Backend Setup & Run

Ensure Python 3.11+ is installed.

```bash
# Create and activate virtual environment (optional)
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
pip install pytest

# Run the FastAPI backend
uvicorn app:app --host 0.0.0.0 --port 8000
```

The backend is now live at `http://localhost:8000`:
- `GET /health` -> `{"status": "ok"}`
- `POST /predict` -> `{"fradulent": 0|1, "fraudulent": 0|1, "pobability": float, "probability": float}`

### 2. Frontend Setup & Run

Open a separate terminal window and navigate to `/frontend`:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`.

### 3. Setting `VITE_API_URL`

By default, in local development Vite proxies `/predict` and `/health` directly to `http://127.0.0.1:8000`.

To point the frontend to a remote or custom API URL:
1. Create a `frontend/.env` file:
   ```env
   VITE_API_URL=https://your-api-domain.com
   ```
2. Or pass it directly when starting the dev server or building:
   ```bash
   VITE_API_URL=http://localhost:8000 npm run dev
   ```

### 4. Production Build

To compile the production bundle:

```bash
cd frontend
npm run build
```

This outputs static assets to `frontend/dist`. When `frontend/dist` exists, the FastAPI backend automatically serves it at `http://localhost:8000/` with full SPA client-route fallback (`/scan`, `/dashboard`)!

---

## 🧪 Smoke Tests

Run backend unit and integration smoke tests using `pytest`:

```bash
pytest -v test_app.py
```

Tests verify:
- `GET /health` returns status `ok`.
- `POST /predict` returns valid probabilities between 0 and 1 with both legacy misspelled and clean keys.
- Pydantic validation rejects empty titles with HTTP 422.
- Client-side SPA routes (`/`, `/scan`, `/dashboard`) serve HTML properly.

---

## 🐳 Docker Deployment

The multi-stage `Dockerfile` compiles the React frontend with Node 20 and packages the production app inside a lightweight Python 3.11 container:

```bash
# Build the unified container
docker build -t jobguard .

# Run the container
docker run -p 8000:8000 -e PORT=8000 jobguard
```

Access the unified full-stack application at `http://localhost:8000`.
