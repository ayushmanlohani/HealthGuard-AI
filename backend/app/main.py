from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import HealthInput, PredictionResponse
from app.predict import predict_health_risk

app = FastAPI(
    title="HealthGuard AI API",
    description="Health risk prediction API for diabetes and heart disease",
    version="1.0.0"
)

# Enable CORS (so React frontend can call this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """API health check"""
    return {
        "message": "HealthGuard AI API is running",
        "status": "healthy",
        "version": "1.0.0"
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(data: HealthInput):
    """
    Predict diabetes and heart disease risk based on user health data.
    """
    try:
        # Convert Pydantic model to dict
        user_data = {
            "general_health": data.general_health,
            "checkup": data.checkup,
            "exercise": data.exercise,
            "skin_cancer": data.skin_cancer,
            "other_cancer": data.other_cancer,
            "depression": data.depression,
            "arthritis": data.arthritis,
            "sex": data.sex,
            "age_category": data.age_category,
            "height": data.height,
            "weight": data.weight,
            "smoking_history": data.smoking_history,
            "alcohol_consumption": data.alcohol_consumption,
            "fruit_consumption": data.fruit_consumption,
            "green_vegetables_consumption": data.green_vegetables_consumption,
            "fried_potato_consumption": data.fried_potato_consumption
        }

        # Get predictions
        result = predict_health_risk(user_data)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/health")
def health_check():
    """Check if models are loaded"""
    from app.predict import diabetes_model, heart_model, scaler
    return {
        "models_loaded": True,
        "diabetes_model": str(type(diabetes_model)),
        "heart_model": str(type(heart_model)),
        "scaler": str(type(scaler))
    }
