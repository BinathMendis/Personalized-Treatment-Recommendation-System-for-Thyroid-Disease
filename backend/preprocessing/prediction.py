import joblib
import pandas as pd
import shap
import numpy as np
import os

# Load model and preprocessing tools
model_path = "models/best_model.pkl"
scaler_path = "models/scaler.pkl"
encoder_path = "models/label_encoders.pkl"

if not os.path.exists(model_path) or not os.path.exists(scaler_path) or not os.path.exists(encoder_path):
    raise FileNotFoundError("Required model files are missing. Please check the models directory.")

best_rf_model = joblib.load(model_path)
scaler = joblib.load(scaler_path)
label_encoders = joblib.load(encoder_path)

# Retrieve correct feature order
model_feature_names = best_rf_model.feature_names_in_.tolist()
print("\n✅ Feature Names in Model:", model_feature_names)

# Load SHAP explainer
explainer = shap.Explainer(best_rf_model)

# 🔮 Prediction Function
def predict_patient_risk(patient_data):
    try:
        patient_df = pd.DataFrame([patient_data])

        # ✅ Ensure correct column order
        patient_df = patient_df[model_feature_names]

        # ✅ Normalize numerical values
        numerical_cols = ["Age", "Weight_kg", "Height_cm", "TSH", "T3", "T4", "Anti_Thyroid_Antibodies", "Sleep_Hours"]
        patient_df[numerical_cols] = scaler.transform(patient_df[numerical_cols])

        # ✅ Encode categorical values
        categorical_cols = ["Gender", "Family_History", "Existing_Conditions", "Symptoms", 
                            "Diet", "Exercise", "Smoking", "Alcohol", "Medication"]

        for col in categorical_cols:
            known_classes = label_encoders[col].classes_

            # ✅ Ensure 'Unknown' exists before transforming
            if "Unknown" not in known_classes:
                label_encoders[col].classes_ = np.append(known_classes, "Unknown")

            if patient_df[col][0] not in label_encoders[col].classes_:
                print(f"⚠️ Warning: Unseen category '{patient_df[col][0]}' in column '{col}'. Using 'Unknown'.")
                patient_df[col] = "Unknown"

            patient_df[col] = label_encoders[col].transform([patient_df[col][0]])[0]

        # ✅ Make prediction
        prediction = best_rf_model.predict(patient_df)[0]
        prediction_proba = best_rf_model.predict_proba(patient_df)[0]

        # ✅ SHAP explanation
        shap_values = explainer(patient_df)
        shap_summary = {feature: round(float(np.mean(shap_values.values[0][i])), 5) for i, feature in enumerate(model_feature_names)}

        # ✅ Sort SHAP values by impact
        shap_sorted = sorted(shap_summary.items(), key=lambda x: abs(x[1]), reverse=True)
        shap_top = shap_sorted[:4]  # Top 4 features

        return {
            "predicted_risk": prediction,
            "confidence": round(max(prediction_proba) * 100, 2),
            "shap_values": shap_top
        }

    except Exception as e:
        return {"error": str(e)}
