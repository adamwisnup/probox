const telemetry = require("../models/TelemetryData");

const getTelemetryController = async (req, res) => {
  try {
    const telemetryData = await telemetry.getTelemetryData();
    const telemetryDB = await telemetry.getLatestTelemetryDB();

    const getData = {
      uid: telemetryDB[0].uid,
      status: telemetryData.Status,
      tap: telemetryData.Tap,
      timestamp: telemetryDB[0].timestamp,
    };
    res.status(200).json({
      status: 200,

      message: "success",
      data: getData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching telemetry data." });
  }
};

module.exports = {
  getTelemetryController,
};
