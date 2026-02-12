const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({
        backend: "ok",
        database: "connected" //TODO-- implement actual database connection check
    });
});

module.exports = router;
