const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const router = express.Router();

router.post("/predict", (req, res) => {

    const { quizScore, accuracy, timeSpent } = req.body;

    console.log("Prediction Input:", quizScore, accuracy, timeSpent);

const pythonFile = path.join(__dirname, "../../ml/load_model.py");

const python = spawn(
    path.join(__dirname, "../../venv/Scripts/python.exe"),
    [
        pythonFile,
        quizScore,
        accuracy,
        timeSpent
    ]
);
    python.stderr.on("data", (data) => {
    console.log("Python Error:", data.toString());
});

    let result = "";

    python.stdout.on("data", (data) => {
        result += data.toString();
    });

    python.on("close", () => {

            console.log("Prediction:", result.trim());

        res.json({
            recommendation: result.trim()
        });
    });

});

module.exports = router;