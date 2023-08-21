const telemetry = require("../models/TelemetryData");

const getTelemetryController = async (req, res) => {
  try {
    const telemetryData = await telemetry.getTelemetryData();
    const telemetryDB = await telemetry.getLatestTelemetryDB();

    const getData = {
      uid: telemetryDB[0].uid || null,
      status: telemetryData.status || null,
      lock: telemetryData.lock || null, //? "buka" : "tutup"
      timestamp: telemetryDB[0].timestamp || null,
    };

    res.status(200).json({
      status: 200,
      message: "success",
      data: getData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getTelemetryController,
};
