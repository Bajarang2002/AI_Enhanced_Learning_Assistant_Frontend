# 🧠 AI-Enhanced Learning Assistant

An advanced, enterprise-grade AI-powered educational platform featuring a **FastAPI** asynchronous REST backend and an **Angular 18+** single-page frontend (SPA). 

The platform empowers users to securely authenticate via RFC 7519 JWT, train sequence models (**RNN**, **LSTM**, and **BiLSTM**) using **PyTorch**, visualize diagnostic training/validation convergence curves with **Chart.js**, synthesize domain-coherent assessments (**Objective MCQs**, **Subjective**, and **Comprehensive**), and evaluate student answer submissions against reference rubrics with automated semantic scoring and actionable diagnostic feedback.

---

## 🏛️ Project Structure

The project is cleanly decoupled into two standalone applications:

```
AI_Enhaced_Learning_Assistant_using_RNN_LSTM_BILSTM/
│
├── fastapi_backend/                   # FastAPI Asynchronous REST API
│   ├── config.py                      # Application settings & environment paths
│   ├── db.py                          # Dual-mode PostgreSQL & SQLite database manager
│   ├── jwt_auth.py                    # RFC 7519 pure-Python HS256 JWT auth engine
│   ├── schemas.py                     # Pydantic request/response schemas
│   ├── train_model_pipeline.py        # PyTorch RNN / LSTM / BiLSTM training pipeline
│   ├── evaluator.py                   # Semantic TF-IDF similarity & rubric evaluation
│   ├── objective.py                   # Semantic MCQ question generator
│   ├── subjective.py                  # Analytical subjective question generator
│   ├── main.py                        # FastAPI root app & CORS configuration
│   ├── models/                        # Saved PyTorch checkpoint & metadata
│   ├── routers/                       # Modular REST controllers
│   ├── static/                        # Profile pictures & static assets
│   ├── uploads/                       # Sample datasets & uploads
│   ├── requirements.txt               # Python dependencies
│   ├── run_backend.bat                # Windows quick-launch script
│   └── README.md                      # Backend API documentation & Swagger guide
│
├── angular_frontend/                  # Angular 18+ Single Page Application
│   ├── package.json                   # Angular & UI dependencies (Bootstrap 5, Chart.js)
│   ├── angular.json                   # Angular workspace configuration
│   ├── run_frontend.bat               # Windows quick-launch script
│   ├── README.md                      # Frontend architecture & setup guide
│   └── src/
│       ├── index.html                 # App shell with Google Fonts & Bootstrap CDN
│       ├── styles.css                 # 4-palette dynamic theme engine
│       ├── environments/              # Backend endpoint configurations
│       └── app/
│           ├── app.routes.ts          # Angular client router
│           ├── components/            # Standalone Angular components
│           │   ├── home/              # SaaS landing page
│           │   ├── login/             # User login
│           │   ├── signup/            # User registration
│           │   ├── forgot-password/   # Password reset request
│           │   ├── reset-password/    # Password token reset
│           │   └── dashboard/         # Dashboard with responsive sidebar
│           │       ├── upload-train/          # Model dataset upload & training
│           │       ├── model-accuracy/        # KPI cards & Chart.js curves
│           │       ├── question-generation/   # Multi-format Q&A generation
│           │       ├── answer-evaluation/     # Dual sheet rubric evaluation
│           │       ├── settings/              # Password change & theme switcher
│           │       └── update-profile/        # Profile & avatar management
│           ├── services/              # HTTP services & JWT interceptors
│           └── models/                # Strongly-typed TypeScript interfaces
│
├── MIGRATION_GUIDE.md                 # Full migration and architectural documentation
└── .gitignore                         # Git exclusion rules
```

---

## 🚦 Quick Start Guide

### 1. Launch FastAPI Backend (Port 8000)
```bash
cd fastapi_backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*(Or double-click `fastapi_backend/run_backend.bat`)*

- **API Status**: [http://localhost:8000/](http://localhost:8000/)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Interactive ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Launch Angular Frontend (Port 4200)
```bash
cd angular_frontend
npm install
npm start
```
*(Or double-click `angular_frontend/run_frontend.bat`)*

- **Web Application**: 👉 [http://localhost:4200/](http://localhost:4200/)

---

## 🎨 Dynamic 4-Palette Theme Engine
The frontend includes a dynamic theme switcher with persistent local storage:
1. 🍷 **Academic Crimson** (Default): Burgundy headers with maroon accents and gold badges.
2. 🌟 **Modern Indigo**: Deep slate navbar with electric indigo highlights.
3. 🌊 **Ocean Teal**: Marine navy sidebar with cyan and sky-blue highlights.
4. ☀️ **Minimal Slate**: High-contrast minimalist productivity theme with emerald accents.

---

## 🔒 Security & Resilience
- **Pure-Python HS256 JWT**: RFC 7519 compliant with PBKDF2 hashing (260,000 rounds) requiring no external compiled binaries.
- **Resilient Dual-Mode Database**: Automatically connects to PostgreSQL if available, and seamlessly falls back to local SQLite (`database.db`) with zero configuration.
- **Type-Safe Communication**: End-to-end type safety with Pydantic models on the backend and TypeScript interfaces on the frontend.
