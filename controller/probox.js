const axios = require("axios");
const { format } = require("date-fns");
const { insertHistory, getAllHistory } = require("../models/probox");
const {
  iotCentralAppUrl,
  deviceId,
  sasToken,
} = require("../config/azureConfig");
const cron = require("node-cron");

const fetchTelemetryData = async () => {
  try {
    const telemetry1Response = await axios.get(
      `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/uid`,
      {
        headers: {
          Authorization: `SharedAccessSignature ${sasToken}`,
        },
      }
    );

    const telemetry2Response = await axios.get(
      `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/box`,
      {
        headers: {
          Authorization: `SharedAccessSignature ${sasToken}`,
        },
      }
    );

    const telemetry3Response = await axios.get(
      `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/tap`,
      {
        headers: {
          Authorization: `SharedAccessSignature ${sasToken}`,
        },
      }
    );

    const UID = telemetry1Response.data.value || null;
    const status = telemetry2Response.data.value;
    const tap = telemetry3Response.data.value;
    const timestamp = format(new Date(), "dd-MM-yyyy HH:mm:ss");

    if (UID !== null) {
      await insertHistory(UID, status, tap, timestamp);
    }
  } catch (error) {
    console.error("Error fetching telemetry data:", error);
  }
};

// Jadwalkan panggilan fetchTelemetryData menggunakan cron
cron.schedule("* * * * * *", async () => {
  await fetchTelemetryData();
});

const getAllHistoryController = async (req, res) => {
  try {
    const historyData = await getAllHistory(); // Panggil fungsi getAllHistory untuk mendapatkan data dari database

    if (Array.isArray(historyData)) {
      res.json({
        message: "GET all history success",
        data: historyData,
      });
    } else {
      res.status(500).json({
        message: "Server Error",
        error: "Unexpected data format",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  fetchTelemetryData,
  getAllHistoryController,
};
