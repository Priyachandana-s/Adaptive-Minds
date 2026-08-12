import pandas as pd
from sklearn.tree import DecisionTreeClassifier
import pickle

data=pd.read_csv("student_performance.csv")
X = data[["quiz_score", "accuracy", "time_spent"]]
y = data["difficulty"]
model = DecisionTreeClassifier()
model.fit(X, y)

# Save model
with open("adaptive_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("Model Saved Successfully!")