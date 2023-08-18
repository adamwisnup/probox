const dbConnection = require("../config/dbConfig");

const insertHistory = async (uid, status, tap, timestamp) => {
  const sql = `INSERT INTO history(uid, status,tap, timestamp)
    VALUES (?, ?, ?)`;
  const values = [uid, status, tap, timestamp];

  try {
    const [result] = await dbConnection.query(sql, values);
    return result;
  } catch (ex) {
    throw ex;
  }
};

const getAllHistory = async () => {
  const query =
    "SELECT * FROM history WHERE id < (SELECT MAX(id) FROM history) ORDER BY id DESC LIMIT 4";

  try {
    const [results] = await dbConnection.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertHistory,
  getAllHistory,
};
