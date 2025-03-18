import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import GridSearchCV

# 1️⃣ Load Preprocessed Data
X_train = joblib.load("models/X_train.pkl")
X_test = joblib.load("models/X_test.pkl")
y_train = joblib.load("models/y_train.pkl")
y_test = joblib.load("models/y_test.pkl")

# 2️⃣ Define Hyperparameter Grid for Tuning
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

# 3️⃣ Perform Grid Search with Cross-Validation
grid_search = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5, n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)

# 4️⃣ Train Best Model Found
best_rf_model = grid_search.best_estimator_
best_rf_model.fit(X_train, y_train)

# 5️⃣ Evaluate Model Performance
y_pred = best_rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print("✅ Model Training & Optimization Complete!")
print(f"🎯 Best Parameters: {grid_search.best_params_}")
print(f"🎯 Accuracy: {accuracy:.2f}")
print("📊 Classification Report:\n", report)

# 6️⃣ Save the Trained Model
joblib.dump(best_rf_model, "models/best_model.pkl")

print("💾 Model saved as 'best_model.pkl' for later use!")
