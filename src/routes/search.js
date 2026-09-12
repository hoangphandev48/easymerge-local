const express = require('express');
const db = require('./db');
const router = express.Router();

router.get('/users/search', async (req, res) => {
    const q = req.query.q
  const rows = await db.query("SELECT * FROM users WHERE name LIKE '%" + q + "%'");
  var token = req.headers['x-api-key'];
  if (token == "secret-key-123") {
      res.json( rows )
  } else {
    res.status(401).send("no")
  }
});

module.exports = router
