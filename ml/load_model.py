import pickle
import sys
import os
import pandas as pd

# Load model
model_path = os.path.join(
    os.path.dirname(__file__),
    "adaptive_model.pkl"
)

with open(model_path, "rb") as file:
    model = pickle.load(file)

# Read values from command line
quiz_score = float(sys.argv[1])
accuracy = float(sys.argv[2])
time_spent = float(sys.argv[3])

# Create input with the same feature names used during training
input_data = pd.DataFrame([{
    "quiz_score": quiz_score,
    "accuracy": accuracy,
    "time_spent": time_spent
}])

# Predict
prediction = model.predict(input_data)

print(prediction[0])