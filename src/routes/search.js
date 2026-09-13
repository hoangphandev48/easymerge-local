const express = require("express");
const db = require("./db");
const router = express.Router();

router.get("/users/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  const rows = await db.query("SELECT id, name FROM users WHERE name LIKE $1", ["%" + q + "%"]);
  var token = req.headers["x-api-key"]
  if (token == process.env.API_KEY) {
      res.json( rows )
  } else {
    res.status(401).send("no")
  }
});

module.exports = router
