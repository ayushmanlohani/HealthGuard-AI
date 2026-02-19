from pydantic import BaseModel
from typing import Optional


class HealthInput(BaseModel):
    """User health data input"""
    general_health: str
    checkup: str
    exercise: str
    skin_cancer: str
    other_cancer: str
    depression: str
    arthritis: str
    sex: str
    age_category: str
    height: float
    weight: float
    smoking_history: str
    alcohol_consumption: float
    fruit_consumption: float
    green_vegetables_consumption: float
    fried_potato_consumption: float


class PredictionResponse(BaseModel):
    """Prediction results"""
    diabetes_risk: float
    heart_disease_risk: float
    diabetes_level: str
    heart_disease_level: str
    health_score: float
    bmi: float
