const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const db = require("../config/db");

const router = express.Router();

router.get("/csvquestions", (req, res) => {

    const { subject, topic, difficulty } = req.query;

    // Get subject name from MySQL
    db.query(
        "SELECT name FROM subjects WHERE id = ?",
        [subject],
        (err, subjectResult) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (subjectResult.length === 0) {
                return res.json([]);
            }

            const subjectName = subjectResult[0].name;

            // Get topic name from MySQL
            db.query(
                "SELECT topic_name FROM topics WHERE id = ?",
                [topic],
                (err, topicResult) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    if (topicResult.length === 0) {
                        return res.json([]);
                    }

                    const topicName = topicResult[0].topic_name;

                    // Convert topic name to CSV filename
                    const fileNames = {
                        "Arrays": "arrays.csv",
                        "Linked List": "linked_list.csv",
                        "Stack": "stack.csv",
                        "Queue": "queue.csv",
                        "Trees": "trees.csv",
                        "Graphs": "graphs.csv"
                    };

                    const fileName = fileNames[topicName];

                    if (!fileName) {
                        return res.status(404).json({
                            message: "CSV file not found for this topic"
                        });
                    }

                    const filePath = path.join(
                        __dirname,
                        "../../dataset/dsa",
                        fileName
                    );

                    if (!fs.existsSync(filePath)) {
                        return res.status(404).json({
                            message: `File not found: ${fileName}`
                        });
                    }

                    const questions = [];

                    // Read selected topic CSV
                    fs.createReadStream(filePath)
                        .pipe(csv())
                        .on("data", (row) => {

                            if (
                                row.Subject &&
                                row.Topic &&
                                row.Difficulty
                            ) {
                                questions.push(row);
                            }

                        })
                        .on("end", () => {

                            // Filter by difficulty
                            let filteredQuestions = questions.filter((q) => {

                                return (
                                    q.Subject.trim() === subjectName.trim() &&
                                    q.Topic.trim() === topicName.trim() &&
                                    q.Difficulty.trim() === difficulty.trim()
                                );

                            });

                            console.log("Subject:", subjectName);
                            console.log("Topic:", topicName);
                            console.log("Difficulty:", difficulty);
                            console.log("CSV:", fileName);
                            console.log(
                                "Matching Questions:",
                                filteredQuestions.length
                            );

                            // Shuffle
                            filteredQuestions.sort(
                                () => Math.random() - 0.5
                            );

                            // Send only 5 questions
                            res.json(
                                filteredQuestions.slice(0, 5)
                            );

                        })
                        .on("error", (error) => {

                            console.log("CSV Error:", error);

                            res.status(500).json({
                                message: "Error reading CSV file"
                            });

                        });

                }
            );

        }
    );

});

module.exports = router;