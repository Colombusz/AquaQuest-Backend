from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os
from sklearn.linear_model import LinearRegression
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Define model path
MODEL_PATH = "Machine Learning/water_model.pkl"

# Function to load or train the model
def train_or_load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)  # Load the saved model
    else:
        return LinearRegression()  # If no model exists, create a new one

# Load models
cost_model = train_or_load_model()
consumption_model = train_or_load_model()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        past_data = data.get("past_data")  # Array of past water bills
        months_ahead = int(data.get("months_ahead", 1))  # User-defined months

        if not past_data or len(past_data) < 3:
            return jsonify({"error": "At least 3 months of data is required."}), 400

        # Convert data to DataFrame
        df = pd.DataFrame(past_data)
        df["month"] = range(1, len(df) + 1)

        X = df[["month"]]
        y_cost = df["cost"]
        y_consumption = df["consumption"]

        # Train models if they haven't been trained before
        if not os.path.exists(MODEL_PATH):
            cost_model.fit(X, y_cost)
            consumption_model.fit(X, y_consumption)
            joblib.dump(cost_model, MODEL_PATH)  # Save trained model
            joblib.dump(consumption_model, MODEL_PATH)

        # Predict future months
        future_months = np.array([[len(df) + i] for i in range(1, months_ahead + 1)])
        predicted_costs = cost_model.predict(future_months).tolist()
        predicted_consumptions = consumption_model.predict(future_months).tolist()

        return jsonify({
            "predicted_costs": predicted_costs,
            "predicted_consumptions": predicted_consumptions
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)



# from flask import Flask, request, jsonify
# import pandas as pd
# import joblib
# import os
# from sklearn.linear_model import LinearRegression
# import numpy as np
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# # Define model paths
# COST_MODEL_PATH = "Machine Learning/water_cost_model.pkl"
# CONSUMPTION_MODEL_PATH = "Machine Learning/water_consumption_model.pkl"

# # Function to load or train the model
# def train_or_load_model(model_path):
#     if os.path.exists(model_path):
#         return joblib.load(model_path)  # Load the saved model
#     else:
#         return LinearRegression()  # If no model exists, create a new one

# # Load models
# cost_model = train_or_load_model(COST_MODEL_PATH)
# consumption_model = train_or_load_model(CONSUMPTION_MODEL_PATH)

# @app.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.json
#         past_data = data.get("past_data")  # Array of past water bills
#         months_ahead = int(data.get("months_ahead", 1))  # User-defined months

#         if not past_data or len(past_data) < 2:  # **Updated to allow at least 2 months**
#             return jsonify({"error": "At least 2 months of data is required."}), 400

#         # Convert data to DataFrame
#         df = pd.DataFrame(past_data)
#         df["month"] = range(1, len(df) + 1)

#         X = df[["month"]]
#         y_cost = df["cost"]
#         y_consumption = df["consumption"]

#         # Train models if they haven't been trained before
#         if not os.path.exists(COST_MODEL_PATH) or not os.path.exists(CONSUMPTION_MODEL_PATH):
#             cost_model.fit(X, y_cost)
#             consumption_model.fit(X, y_consumption)
#             joblib.dump(cost_model, COST_MODEL_PATH)  # Save trained cost model
#             joblib.dump(consumption_model, CONSUMPTION_MODEL_PATH)  # Save trained consumption model

#         # Predict future months
#         future_months = np.array([[len(df) + i] for i in range(1, months_ahead + 1)])
#         predicted_costs = cost_model.predict(future_months).tolist()
#         predicted_consumptions = consumption_model.predict(future_months).tolist()

#         return jsonify({
#             "predicted_costs": predicted_costs,
#             "predicted_consumptions": predicted_consumptions
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5001, debug=True)
