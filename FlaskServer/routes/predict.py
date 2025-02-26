# from flask import Blueprint, request, jsonify
# import pandas as pd
# import numpy as np
# import joblib
# import os
# from models.train_model import cost_model, consumption_model, MODEL_PATH

# predict_blueprint = Blueprint('predict', __name__)

# @predict_blueprint.route('/predict', methods=['POST'])
# def predict():
#     try:
#         data = request.json
#         past_data = data.get("past_data")  # Array of past water bills
#         months_ahead = int(data.get("months_ahead", 1))

#         if not past_data or len(past_data) < 3:
#             return jsonify({"error": "At least 3 months of data is required."}), 400

#         df = pd.DataFrame(past_data)
#         df["month"] = range(1, len(df) + 1)

#         X = df[["month"]]
#         y_cost = df["cost"]
#         y_consumption = df["consumption"]

#         # Train models if needed
#         if not os.path.exists(MODEL_PATH):
#             cost_model.fit(X, y_cost)
#             consumption_model.fit(X, y_consumption)
#             joblib.dump(cost_model, MODEL_PATH)
#             joblib.dump(consumption_model, MODEL_PATH)

#         # Predict future values
#         future_months = np.array([[len(df) + i] for i in range(1, months_ahead + 1)])
#         predicted_costs = cost_model.predict(future_months).tolist()
#         predicted_consumptions = consumption_model.predict(future_months).tolist()

#         return jsonify({
#             "predicted_costs": predicted_costs,
#             "predicted_consumptions": predicted_consumptions
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500




from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np
import joblib
import os
from models.train_model import cost_model, consumption_model, MODEL_PATH

predict_blueprint = Blueprint('predict', __name__)

# Ensure model exists before running predictions
if not os.path.exists(MODEL_PATH):
    from models.training import train_and_save_model
    train_and_save_model()

@predict_blueprint.route('/predict-cost', methods=['POST'])
def predict_cost():
    try:
        data = request.json
        past_data = data.get("past_data", [])
        months_ahead = int(data.get("months_ahead", 1))

        if len(past_data) < 3:
            return jsonify({"error": "At least 3 months of data is required."}), 400

        df = pd.DataFrame(past_data)
        df["month"] = range(1, len(df) + 1)
        X = df[["month"]]

        cost_model.fit(X, df["cost"])
        future_months = np.array([[len(df) + i] for i in range(1, months_ahead + 1)])
        predicted_costs = cost_model.predict(future_months).tolist()

        return jsonify({"predicted_costs": predicted_costs})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@predict_blueprint.route('/predict-consumption', methods=['POST'])
def predict_consumption():
    try:
        data = request.json
        past_data = data.get("past_data", [])
        months_ahead = int(data.get("months_ahead", 1))

        if len(past_data) < 3:
            return jsonify({"error": "At least 3 months of data is required."}), 400

        df = pd.DataFrame(past_data)
        df["month"] = range(1, len(df) + 1)
        X = df[["month"]]

        consumption_model.fit(X, df["consumption"])
        future_months = np.array([[len(df) + i] for i in range(1, months_ahead + 1)])
        predicted_consumptions = consumption_model.predict(future_months).tolist()

        return jsonify({"predicted_consumptions": predicted_consumptions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
