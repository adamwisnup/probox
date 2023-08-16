const express = require("express");
const { getAllHistoryController } = require("../controller/probox");

const router = express.Router();

router.get("/probox/history", getAllHistoryController);

module.exports = router;
