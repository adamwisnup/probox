const axios = require("axios");
const { format } = require("date-fns");
const {
  insertHistory,
  getAllHistory,
  getRowCount,
  deleteHistoryData,
} = require("../models/probox");
const {
  iotCentralAppUrl,
  deviceId,
  sasToken,
} = require("../config/azureConfig");
const cron = require("node-cron");

const fetchTelemetryData = async () => {
  try {
    const telemetry1Response = await axios.get(
      `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/UID`,
      {
        headers: {
          Authorization: `SharedAccessSignature ${sasToken}`,
        },
      }
    );

    const telemetry2Response = await axios.get(
      `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/Status`,
      {
        headers: {
          Authorization: `SharedAccessSignature ${sasToken}`,
        },
      }
    );

    const telemetry3Response = await axios.get(
      `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/Lock`,
      {
        headers: {
          Authorization: `SharedAccessSignature ${sasToken}`,
        },
      }
    );

    const uid = telemetry1Response.data.value || null;
    const status = telemetry2Response.data.value;
    const lock = telemetry3Response.data.value;
    const timestamp = format(new Date(), "dd-MM-yyyy HH:mm:ss");

    if (uid !== null) {
      await insertHistory(uid, status, lock, timestamp);
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const manageHistoryData = async () => {
  try {
    const rowCount = await getRowCount();

    if (rowCount > 6) {
      const deleteCount = rowCount - 6;
      await deleteHistoryData(deleteCount);
      console.log(`${deleteCount} rows of history data deleted.`);
    }
  } catch (error) {
    console.error("Error managing history data:", error);
  }
};

cron.schedule("* * * * * *", async () => {
  console.log("Fetching telemetry data...");
  await fetchTelemetryData();
  await manageHistoryData();
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
