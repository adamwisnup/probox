const axios = require("axios");
const {
  iotCentralAppUrl,
  deviceId,
  sasToken,
} = require("../config/azureConfig");
const dbConnection = require("../config/dbConfig");

const getTelemetryData = async () => {
  const telemetry1Response = await axios.get(
    `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/box`,
    {
      headers: {
        Authorization: `SharedAccessSignature ${sasToken}`,
      },
    }
  );
  const telemetry2Response = await axios.get(
    `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/tap`,
    {
      headers: {
        Authorization: `SharedAccessSignature ${sasToken}`,
      },
    }
  );

  return {
    Status: telemetry1Response.data.value,
    Tap: telemetry2Response.data.value,
  };
};

const getLatestTelemetryDB = async () => {
  const query = "SELECT uid, timestamp FROM history ORDER BY id DESC LIMIT 1";

  try {
    const [results] = await dbConnection.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getTelemetryData,
  getLatestTelemetryDB,
};
