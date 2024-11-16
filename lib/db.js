import mysql from "mysql2/promise";

let connection;

export const connectToDatabase = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: "localhost",
        user: "if0_37725314",
        password: "4CHJ5GSU8FIe",
        database: "if0_37725314_alumni",
      });
    }
    return connection;
  } catch (err) {
    console.log(err);
  }
};