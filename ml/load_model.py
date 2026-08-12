import pickle
import sys

# Load model
import os

model_path = os.path.join(os.path.dirname(__file__), "adaptive_model.pkl")

with open(model_path, "rb") as file:
    model = pickle.load(file)

# Read values from command line
quiz_score = float(sys.argv[1])
accuracy = float(sys.argv[2])
time_spent = float(sys.argv[3])

# Predict
prediction = model.predict([[quiz_score, accuracy, time_spent]])

print(prediction[0])