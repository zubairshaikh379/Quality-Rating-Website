import sys
import json
import pickle
import numpy as np
import os

# Dynamically resolve path to .pkl file
model_path = os.path.join(os.path.dirname(__file__), "manu_xgboost_model.pkl")

# Load model
with open(model_path, "rb") as f:
    model = pickle.load(f)

data = json.loads(sys.argv[1])  


# Extract values and convert to numpy array
features = np.array([[float(data["temp"]), float(data["pressure"]),
                      float(data["temp_x_pressure"]), float(data["fusion"]),
                      float(data["transformation"])]])
                      
# Make prediction
prediction = model.predict(features)

# Print predicted value
print(prediction[0])
