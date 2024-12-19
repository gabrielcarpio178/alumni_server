import mysql from "mysql2/promise";

let connection;

export const connectToDatabase = async () => {
  try {
    if (!connection) {
      connection = await mysql.createConnection({
        host: "beh8qi4aww8jzbzeelsm-mysql.services.clever-cloud.com",
        user: "uokjwctskbh6zydq",
        password: "2cxVENWMGU1BCs3kPrgj",
        database: "beh8qi4aww8jzbzeelsm",
      });
    }
    return connection;
  } catch (err) {
    console.log(err);
  }
};