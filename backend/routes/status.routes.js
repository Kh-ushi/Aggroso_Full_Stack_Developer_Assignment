const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const { getHealthStatus } = require("../controllers/status.controller");

router.get("/", getHealthStatus);

module.exports = router;

