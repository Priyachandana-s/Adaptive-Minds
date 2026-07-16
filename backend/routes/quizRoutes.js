const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/questions", (req, res) => {

  const sql = "SELECT * FROM question_bank";

  db.query(sql, (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

module.exports = router;