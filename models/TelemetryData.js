const axios = require("axios");
const {
  iotCentralAppUrl,
  deviceId,
  sasToken,
} = require("../config/azureConfig");
const supabase = require("../config/supabaseConfig");

const getTelemetryData = async () => {
  const telemetry1Response = await axios.get(
    `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/Status`,
    {
      headers: {
        Authorization: `SharedAccessSignature ${sasToken}`,
      },
    }
  );
  const telemetry2Response = await axios.get(
    `${iotCentralAppUrl}/api/preview/devices/${deviceId}/telemetry/Lock`,
    {
      headers: {
        Authorization: `SharedAccessSignature ${sasToken}`,
      },
    }
  );

  return {
    status: telemetry1Response.data.value,
    lock: telemetry2Response.data.value,
  };
};

const getLatestTelemetryDB = async () => {
  const { data, error } = await supabase
    .from("history")
    .select("uid, timestamp")
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  return data;
};

module.exports = {
  getTelemetryData,
  getLatestTelemetryDB,
};
