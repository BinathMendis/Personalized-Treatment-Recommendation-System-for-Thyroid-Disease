import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Load your dataset
data = pd.read_csv("./data/thyroid_data.csv")  # Change this path to your actual dataset

# Define categorical and numerical columns
categorical_cols = ["Gender", "Family_History", "Existing_Conditions", "Symptoms", 
                    "Diet", "Exercise", "Smoking", "Alcohol", "Medication"]
numerical_cols = ["Age", "Weight_kg", "Height_cm", "TSH", "T3", "T4", "Anti_Thyroid_Antibodies", "Sleep_Hours"]
target_col = "Risk_Level"  # Change this to your actual target column

# Encode categorical features
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le  # Store the encoder for later use

# Scale numerical features
scaler = StandardScaler()
data[numerical_cols] = scaler.fit_transform(data[numerical_cols])

# Split dataset into training and testing sets
X = data[numerical_cols + categorical_cols]
y = data[target_col]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest Model
best_rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
best_rf_model.fit(X_train, y_train)

# Make predictions
y_pred = best_rf_model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average="weighted")
recall = recall_score(y_test, y_pred, average="weighted")
f1 = f1_score(y_test, y_pred, average="weighted")

# Print evaluation metrics
print(f"✅ Model Evaluation Metrics:")
print(f"🔹 Accuracy: {accuracy:.4f}")
print(f"🔹 Precision: {precision:.4f}")
print(f"🔹 Recall: {recall:.4f}")
print(f"🔹 F1-score: {f1:.4f}")

# Ensure 'models' directory exists
os.makedirs("models", exist_ok=True)

# Save the trained model and preprocessing tools
joblib.dump(best_rf_model, "models/best_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")
joblib.dump(label_encoders, "models/label_encoders.pkl")

print("✅ Model training complete! Saved model to 'models/best_model.pkl'.")
