import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Ensure models folder exists
os.makedirs("models", exist_ok=True)

# Load the dataset
df = pd.read_csv("../../dataset/thyroid_data.csv")

# 1️⃣ Handle Missing Values (if any)
df.fillna(df.mean(numeric_only=True), inplace=True)  # Fill missing numerical values with mean
df.fillna("Unknown", inplace=True)  # Fill missing categorical values with 'Unknown'

# 2️⃣ Convert Categorical Data to Numerical
categorical_cols = ["Gender", "Family_History", "Existing_Conditions", "Symptoms", 
                    "Diet", "Exercise", "Smoking", "Alcohol", "Medication"]
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = df[col].astype(str)  # Ensure all values are strings
    unique_values = df[col].unique().tolist() + ["Unknown"]  # Ensure 'Unknown' is included
    le.fit(unique_values)  
    df[col] = le.transform(df[col])  
    label_encoders[col] = le  

# 3️⃣ Normalize Numerical Features
scaler = StandardScaler()
numerical_cols = ["Age", "Weight_kg", "Height_cm", "TSH", "T3", "T4", "Anti_Thyroid_Antibodies", "Sleep_Hours"]
df[numerical_cols] = scaler.fit_transform(df[numerical_cols])

# 4️⃣ Split Data into Training & Testing Sets
X = df.drop(columns=["Patient_ID", "Disease_Progression"])  
y = df["Disease_Progression"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5️⃣ Train the Model (Random Forest Classifier)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# 6️⃣ Save Preprocessed Data, Model, and Encoders
joblib.dump(X_train, "models/X_train.pkl")
joblib.dump(X_test, "models/X_test.pkl")
joblib.dump(y_train, "models/y_train.pkl")
joblib.dump(y_test, "models/y_test.pkl")
joblib.dump(rf_model, "models/best_model.pkl")  
joblib.dump(scaler, "models/scaler.pkl")
joblib.dump(label_encoders, "models/label_encoders.pkl")  # ✅ Fix filename issue

print("✅ Data preprocessing & model training completed! Model saved as 'models/best_model.pkl'")
