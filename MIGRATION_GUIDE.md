# Migration Guide: Flask + Jinja2 to FastAPI + Angular 18

This document summarizes the complete architectural transformation of the **AI-Enhanced Learning Assistant using RNN, LSTM, and BiLSTM** from a monolithic Flask application with Jinja2 server-side rendering into a decoupled, modern **FastAPI** backend and **Angular 18+** single-page application (SPA).

---

## 🏛️ Architecture Comparison

| Architectural Aspect | Legacy Implementation | New Architecture | Logic Preservation |
|---|---|---|---|
| **Backend Framework** | Flask (Synchronous WSGI) | FastAPI (Asynchronous ASGI + Uvicorn) | 100% Identical PyTorch, NLTK, Sklearn, and NLP logic |
| **Frontend Framework** | Jinja2 Server-Side Templates + jQuery | Angular 18 Standalone Components + TypeScript | 100% Identical Bootstrap 5 CSS, FontAwesome 6, Chart.js, layouts, and theme switcher |
| **Authentication** | Session-based / Manual JWT cookie | Stateless RFC 7519 HS256 JWT Bearer Auth with HTTP Interceptor | 100% Identical PBKDF2 hashing (260,000 rounds) & secret |
| **Database Access** | Synchronous psycopg2 / SQLite | Dual-mode auto-reconnecting PostgreSQL pool with instant SQLite fallback | 100% Identical table schemas, queries, and fallback logic |
| **API Format** | HTML Form Posts / Redirects | Standardized JSON REST API with Pydantic Schema Validation | Clean JSON contracts for all operations |
| **API Documentation** | None | Interactive Swagger UI (`/docs`) & ReDoc (`/redoc`) | Fully auto-generated OpenAPI 3.1.0 specifications |

---

## 📁 Repository Structure

```
AI_Enhaced_Learning_Assistant_using_RNN_LSTM_BILSTM/
│
├── fastapi_backend/                   # FastAPI Backend Application
│   ├── config.py                      # Environment and path configurations
│   ├── db.py                          # Dual-mode PostgreSQL/SQLite manager
│   ├── jwt_auth.py                    # RFC 7519 pure-python JWT engine & auth dependencies
│   ├── schemas.py                     # Pydantic models for validation
│   ├── main.py                        # FastAPI application entry point
│   ├── evaluator.py                   # Semantic answer evaluation engine
│   ├── train_model_pipeline.py        # PyTorch RNN/LSTM/BiLSTM training pipeline
│   ├── objective.py                   # MCQ question generation engine
│   ├── subjective.py                  # Subjective question generation engine
│   ├── reference_answers.txt          # Default reference rubric answers
│   ├── requirements.txt               # Python package dependencies
│   ├── run_backend.bat                # Windows quick launcher
│   ├── models/                        # Saved model checkpoints and metadata
│   └── routers/                       # REST API route controllers
│       ├── auth.py
│       ├── profile.py
│       ├── training.py
│       ├── metrics.py
│       ├── questions.py
│       └── evaluation.py
│
├── angular_frontend/                  # Angular 18+ Frontend Single Page Application
│   ├── package.json                   # NPM dependencies (Angular 18, Bootstrap 5, Chart.js)
│   ├── angular.json                   # Angular workspace configuration
│   ├── tsconfig.json                  # TypeScript compiler settings
│   ├── run_frontend.bat               # Windows quick launcher
│   └── src/
│       ├── index.html                 # Main HTML with Fonts, FontAwesome, Bootstrap CDN
│       ├── styles.css                 # Theme variables (Crimson, Indigo, Ocean, Minimal)
│       ├── main.ts                    # Bootstrap Angular application
│       ├── environments/              # API and static URL configuration
│       └── app/
│           ├── app.routes.ts          # Angular client-side router
│           ├── app.config.ts          # Application providers & HTTP interceptors
│           ├── models/                # TypeScript interfaces
│           ├── services/              # Injectable services (Auth, Theme, Training, Metrics, Questions, Evaluation)
│           └── components/
│               ├── home/              # Landing page
│               ├── login/             # Login page
│               ├── signup/            # Signup page
│               ├── forgot-password/   # Forgot password page
│               ├── reset-password/    # Reset password page
│               └── dashboard/         # Dashboard shell & nested views
│                   ├── upload-train/
│                   ├── model-accuracy/
│                   ├── question-generation/
│                   ├── answer-evaluation/
│                   ├── settings/
│                   └── update-profile/
│
└── models/                            # Original model checkpoints & metadata
    ├── model_metadata.json
    └── trained_model.pt
```

---

## 🚦 How to Run the Converted Application

### 1. Launch FastAPI Backend
Open a terminal or command prompt:
```bash
cd fastapi_backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
*(Or simply double click `run_backend.bat`)*

Verify backend status:
- API Root: [http://localhost:8000/](http://localhost:8000/)
- Health Check: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Launch Angular Frontend
Open a second terminal or command prompt:
```bash
cd angular_frontend
npm install
npm start
```
*(Or simply double click `run_frontend.bat`)*

Access the application in your browser:
- 👉 **[http://localhost:4200/](http://localhost:4200/)**
