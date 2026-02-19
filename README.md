<div align="center">

# 🛡️ HealthGuard AI

### AI-Powered Health Risk Prediction & Lifestyle Simulator

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

*Predict. Compare. Protect.*

**Every 33 seconds, someone dies from heart disease. Every 5 seconds, someone is diagnosed with diabetes.**
**Up to 80% of these cases are preventable if caught early. HealthGuard AI makes screening instant, free, and accessible.**

[Live Demo](#demo) · [Features](#features) · [Tech Stack](#tech-stack) · [Installation](#installation) · [Architecture](#architecture)

---

</div>

## 📌 Problem Statement

Health screening is broken for most people:
- 🏥 Requires appointments, lab tests, and weeks of waiting
- 💰 Expensive and inaccessible for underserved communities
- 📋 Results are static — patients are told "you're at risk" but not **what to change**
- ⏳ Most people never get screened until symptoms appear — by then, it's too late

## 💡 Our Solution

**HealthGuard AI** is a full-stack web application that:

1. **Predicts** your risk of developing **Diabetes** and **Heart Disease** using ML models trained on **300,000+ real health records**
2. **Scores** your overall health out of 100
3. **Recommends** personalized lifestyle changes based on your specific risk factors
4. **Simulates** — lets you adjust lifestyle factors and watch your risk scores update **in real-time** using live ML predictions

> 💡 No lab work needed. Just 16 simple questions you already know the answers to.

---

## 🎯 Features

### ✅ Core Features

| Feature | Description |
|---------|-------------|
| 🩸 **Dual Disease Prediction** | Predicts both Diabetes and Heart Disease risk simultaneously |
| 📊 **Health Score** | Overall health score out of 100 based on combined risk |
| 📋 **Multi-Step Assessment** | Clean 3-step form (Personal → Health → Lifestyle) |
| 💡 **Smart Recommendations** | Personalized suggestions based on YOUR specific data |
| ⚠️ **Risk Level Classification** | Low / Moderate / High / Critical with color-coded badges |

### 🚀 Advanced Features

| Feature | Description |
|---------|-------------|
| 🎯 **What-If Simulator** | Adjust weight, exercise, smoking, diet, alcohol — risk updates LIVE |
| 📈 **Weight Loss Trajectory** | Chart showing risk change across 0-20kg weight loss (11 live ML predictions) |
| ✨ **Optimal Change Finder** | Brute-force tests 200+ lifestyle combinations to find your lowest possible risk |
| 🏆 **Achievement Toasts** | Celebrates when you cross a risk level threshold |
| 📄 **Action Plan Generator** | Auto-generates a committed action plan based on your simulator choices |

---

## 🏗️ Architecture

```
health-guard/
├── backend/
│   ├── models/
│   │   ├── diabetes_model.pkl      # Trained Random Forest — Diabetes
│   │   ├── heart_model.pkl         # Trained Random Forest — Heart Disease
│   │   ├── scaler.pkl              # StandardScaler (fitted on training data)
│   │   └── feature_columns.pkl     # Feature column names
│   ├── app/
│   │   ├── main.py                 # FastAPI routes & CORS config
│   │   ├── predict.py              # ML inference pipeline
│   │   └── models.py               # Pydantic schemas (request/response)
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx            # Landing page
        │   ├── Assessment.jsx      # Multi-step health form
        │   ├── Results.jsx         # Risk scores & recommendations
        │   └── Simulator.jsx       # What-If lifestyle simulator
        ├── services/
        │   └── api.js              # Axios API calls
        └── App.jsx                 # React Router setup
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18)                  │
│                                                             │
│  User fills 16 fields → POST /predict → Display Results    │
│  Simulator slider move → POST /predict → Update Gauges     │
│  Optimal button click  → 200+ POST /predict → Best combo   │
└─────────────────┬───────────────────────────────────────────┘
                  │ JSON (REST API)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (FastAPI)                      │
│                                                             │
│  Pydantic validates 16 fields                               │
│         ↓                                                   │
│  Ordinal encoding (categorical → numeric)                   │
│         ↓                                                   │
│  BMI calculated (17th feature)                              │
│         ↓                                                   │
│  StandardScaler transforms all 17 features                  │
│         ↓                                                   │
│  ┌──────────────┐    ┌──────────────────┐                   │
│  │ Diabetes RF  │    │ Heart Disease RF │                   │
│  │ predict_proba│    │ predict_proba    │                   │
│  └──────┬───────┘    └────────┬─────────┘                   │
│         ↓                     ↓                             │
│  diabetes_risk%        heart_risk%                          │
│         ↓                     ↓                             │
│  health_score = 100 - (diabetes + heart) / 2                │
│         ↓                                                   │
│  Return JSON: {diabetes_risk, heart_risk, health_score,     │
│                diabetes_level, heart_disease_level, bmi}    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 Machine Learning

### Model Details

| Parameter | Value |
|-----------|-------|
| **Algorithm** | Random Forest Classifier |
| **Dataset** | BRFSS / CVD Dataset (CDC) |
| **Records** | 300,000+ health records |
| **Features** | 17 (16 user inputs + calculated BMI) |
| **Accuracy** | 77%+ |
| **Output** | Probability (0-100%) via `predict_proba` |

### Why Random Forest?

1. **Mixed feature handling** — binary, ordinal, and continuous features without extra preprocessing
2. **Overfitting prevention** — bagging (bootstrap aggregation) across hundreds of trees
3. **Probability output** — `predict_proba` gives calibrated risk percentages, not just yes/no
4. **Tabular data superiority** — tree-based models outperform deep learning on structured data ([NeurIPS 2022](https://arxiv.org/abs/2207.08815))

### Feature Pipeline

```
Input Features (16):
├── Categorical (Ordinal Encoded)
│   ├── General Health    → 1-5 (Poor → Excellent)
│   ├── Last Checkup      → 0-4 (Never → Within past year)
│   └── Age Category      → 1-13 (18-24 → 80+)
├── Binary (0/1)
│   ├── Exercise, Smoking, Depression
│   ├── Arthritis, Skin Cancer, Other Cancer
│   └── Sex (Female=0, Male=1)
├── Continuous
│   ├── Height (cm), Weight (kg)
│   ├── Alcohol, Fruit, Vegetable, Fried Food consumption
│   └── BMI (auto-calculated)
│
→ StandardScaler normalizes all 17 features
→ Ensures no feature dominates due to scale differences
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.10+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/health-guard.git
cd health-guard

# Backend setup
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start React dev server
npm start
```

### Verify Installation

```bash
# Backend health check
curl http://localhost:8000/

# Expected response:
# {"message": "HealthGuard AI API is running", "status": "healthy", "version": "1.0.0"}

# Model health check
curl http://localhost:8000/health

# Expected response:
# {"models_loaded": true, "diabetes_model": "...", "heart_model": "...", "scaler": "..."}
```

---

## 🖥️ API Reference

### `POST /predict`

**Request Body:**
```json
{
    "general_health": "Good",
    "checkup": "Within the past year",
    "exercise": "Yes",
    "skin_cancer": "No",
    "other_cancer": "No",
    "depression": "No",
    "arthritis": "No",
    "sex": "Female",
    "age_category": "30-34",
    "height": 170,
    "weight": 70,
    "smoking_history": "No",
    "alcohol_consumption": 2,
    "fruit_consumption": 30,
    "green_vegetables_consumption": 20,
    "fried_potato_consumption": 10
}
```

**Response:**
```json
{
    "diabetes_risk": 23.4,
    "heart_disease_risk": 34.1,
    "diabetes_level": "Low",
    "heart_disease_level": "Moderate",
    "health_score": 71.3,
    "bmi": 24.2
}
```

### `GET /`
Health check — returns API status and version.

### `GET /health`
Model check — confirms all ML models are loaded.

---

## 📸 Screenshots

| Home Page | Assessment Form |
|-----------|----------------|
| Clean landing with stats & features | 3-step multi-page form |

| Results Page | What-If Simulator |
|-------------|-------------------|
| Risk scores, recommendations, profile | Live gauges, trajectory chart, optimal finder |

---

## 🔒 Ethics & Limitations

### Disclaimer
> This tool provides health risk estimates for **educational purposes only**. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

### Limitations

| Limitation | Mitigation |
|-----------|------------|
| Self-reported data may be inaccurate | Clear input labels with realistic ranges |
| No lab values (blood glucose, cholesterol) | Future integration with wearable APIs |
| 77% accuracy — 23% could be wrong | Conservative thresholds — over-flag rather than miss |
| Training data is US-population biased | Future: region-specific datasets |
| Only 2 diseases covered | Architecture supports plug-and-play model addition |

### Error Philosophy
> **False positive** (flagging healthy person) → They see a doctor unnecessarily → No harm
>
> **False negative** (missing at-risk person) → Dangerous → We minimize this with conservative thresholds
>
> **77% accurate screening is infinitely better than 0% screening**

---

## 🚀 Future Roadmap

- [ ] 📄 **PDF Report Generation** — downloadable health reports
- [ ] 👤 **User Accounts** — track risk changes over time
- [ ] 🫀 **More Diseases** — stroke, kidney disease, cancer screening
- [ ] 🔬 **Lab Integration** — connect with wearable devices for real blood data
- [ ] 🧠 **Explainable AI** — SHAP values showing which features drive YOUR prediction
- [ ] 📱 **Mobile App** — React Native version
- [ ] 🏥 **Doctor Dashboard** — bulk screening tool for clinics
- [ ] 🐳 **Docker Deployment** — containerized for cloud deployment

---

## 🛠️ Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI with hooks & client-side routing |
| **Routing** | React Router v6 | Seamless SPA navigation |
| **Charts** | Recharts | Weight loss trajectory visualization |
| **Backend** | FastAPI | High-performance async API |
| **Validation** | Pydantic | Automatic request schema validation |
| **ML Models** | Scikit-learn | Random Forest classifiers |
| **Scaling** | StandardScaler | Feature normalization |
| **Serialization** | Pickle | Model persistence (.pkl files) |
| **Server** | Uvicorn | ASGI server for FastAPI |


---

## 📄 License

This project is built for educational and hackathon purposes.

---

<div align="center">

### ⭐ If this project helped you, give it a star!

**HealthGuard AI** — *Because the best time to prevent a disease is before you have one.*

</div>
