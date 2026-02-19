import pickle
import numpy as np
import os

# Get the path to models folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load models once when module loads


def load_models():
    with open(os.path.join(MODELS_DIR, "diabetes_model.pkl"), "rb") as f:
        diabetes_model = pickle.load(f)
    with open(os.path.join(MODELS_DIR, "heart_model.pkl"), "rb") as f:
        heart_model = pickle.load(f)
    with open(os.path.join(MODELS_DIR, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    return diabetes_model, heart_model, scaler


diabetes_model, heart_model, scaler = load_models()

# Encoding maps (same as training)
HEALTH_MAP = {"Poor": 1, "Fair": 2, "Good": 3, "Very Good": 4, "Excellent": 5}

CHECKUP_MAP = {
    "Never": 0,
    "5 or more years ago": 1,
    "Within the past 5 years": 2,
    "Within the past 2 years": 3,
    "Within the past year": 4
}

AGE_MAP = {
    "18-24": 1, "25-29": 2, "30-34": 3, "35-39": 4, "40-44": 5,
    "45-49": 6, "50-54": 7, "55-59": 8, "60-64": 9, "65-69": 10,
    "70-74": 11, "75-79": 12, "80+": 13
}


def get_risk_level(risk: float) -> str:
    if risk < 25:
        return "Low"
    elif risk < 55:
        return "Moderate"
    else:
        return "High"


def predict_health_risk(data: dict) -> dict:
    """Takes user health data and returns risk predictions."""
    # Calculate BMI
    height_m = data["height"] / 100
    bmi = data["weight"] / (height_m ** 2)

    # Encode features (must match training order exactly)
    features = np.array([[
        HEALTH_MAP.get(data["general_health"], 3),
        CHECKUP_MAP.get(data["checkup"], 4),
        1 if data["exercise"] == "Yes" else 0,
        1 if data["skin_cancer"] == "Yes" else 0,
        1 if data["other_cancer"] == "Yes" else 0,
        1 if data["depression"] == "Yes" else 0,
        1 if data["arthritis"] == "Yes" else 0,
        1 if data["sex"] == "Male" else 0,
        AGE_MAP.get(data["age_category"], 5),
        data["height"],
        data["weight"],
        bmi,
        1 if data["smoking_history"] == "Yes" else 0,
        data["alcohol_consumption"],
        data["fruit_consumption"],
        data["green_vegetables_consumption"],
        data["fried_potato_consumption"]
    ]])

    # Scale features
    features_scaled = scaler.transform(features)

    # Get predictions
    diabetes_risk = diabetes_model.predict_proba(features_scaled)[0][1] * 100
    heart_risk = heart_model.predict_proba(features_scaled)[0][1] * 100

    # Calculate health score
    health_score = 100 - (diabetes_risk + heart_risk) / 2

    return {
        "diabetes_risk": round(diabetes_risk, 1),
        "heart_disease_risk": round(heart_risk, 1),
        "diabetes_level": get_risk_level(diabetes_risk),
        "heart_disease_level": get_risk_level(heart_risk),
        "health_score": round(health_score, 1),
        "bmi": round(bmi, 1)
    }
