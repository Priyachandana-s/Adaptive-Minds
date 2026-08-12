import pandas as pd
from sklearn.tree import DecisionTreeClassifier

# Load dataset
data = pd.read_csv("student_performance.csv")

# Features
X = data[["quiz_score", "accuracy", "time_spent"]]

# Label
y = data["difficulty"]

# Create model
model = DecisionTreeClassifier()

# Train model
model.fit(X, y)

prediction = model.predict([[92,90,55]])


print("Prediction:", prediction[0])

