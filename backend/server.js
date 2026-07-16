const express = require("express");
const cors = require("cors");
const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const quizRoutes = require("./routes/quizRoutes");
const db = require("./config/db");


const app = express();

app.use(cors());


app.use("/subjects", subjectRoutes);
app.use("/topics", topicRoutes);
app.use("/", quizRoutes);


db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("Connected to MySQL");
    }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});       