import pandas as pd
import numpy as np
import joblib
import os
from sklearn.linear_model import LinearRegression

# Define model save path
MODEL_PATH = "models/water_model.pkl"

# Generate synthetic training data
def generate_training_data(num_months=1000):
    np.random.seed(42)
    base_cost = 1440
    base_consumption = 35
    months = np.arange(1, num_months + 1)
    costs = base_cost + (months * 5) + np.random.normal(0, 50, num_months)
    consumptions = base_consumption + (months * 0.1) + np.random.normal(0, 2, num_months)

    df = pd.DataFrame({
        "month": months,
        "cost": costs.round(2),
        "consumption": consumptions.round(2)
    })
    return df

# Train the model
def train_and_save_model():
    df = generate_training_data()

    # Prepare training data
    X = df[["month"]]
    y_cost = df["cost"]
    y_consumption = df["consumption"]

    # Train models
    cost_model = LinearRegression().fit(X, y_cost)
    consumption_model = LinearRegression().fit(X, y_consumption)

    # Save models
    joblib.dump({"cost_model": cost_model, "consumption_model": consumption_model}, MODEL_PATH)
    print("Model training complete. Saved to:", MODEL_PATH)

# Run training
if __name__ == "__main__":
    train_and_save_model()
