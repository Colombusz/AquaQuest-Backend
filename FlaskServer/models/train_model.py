# import os
# import joblib
# from sklearn.linear_model import LinearRegression

# MODEL_PATH = "models/water_model.pkl"

# def train_or_load_model():
#     if os.path.exists(MODEL_PATH):
#         return joblib.load(MODEL_PATH)
#     else:
#         return LinearRegression()

# # Load models
# cost_model = train_or_load_model()
# consumption_model = train_or_load_model()



import os
import joblib
from sklearn.linear_model import LinearRegression

MODEL_PATH = "models/water_model.pkl"

def train_or_load_model():
    if os.path.exists(MODEL_PATH):
        models = joblib.load(MODEL_PATH)
        return models["cost_model"], models["consumption_model"]
    else:
        return LinearRegression(), LinearRegression()

# Load models
cost_model, consumption_model = train_or_load_model()
