import pickle

# Load saved model
with open("adaptive_model.pkl", "rb") as file:
    model = pickle.load(file)

# Predict
prediction = model.predict([[85,82,45]])

print("Prediction:", prediction[0])