import mongoose from "mongoose";

const DB_URI = Bun.env.DB_URI || "";

const initDB = (): void => {
  mongoose
    .connect(DB_URI)
    .then(() => console.info(`Successfully connected to ${DB_URI} ...`));

  mongoose.connection.on("error", (err) => {
    console.log("===ERR===", err);
    throw new Error(`Unable to connect to database ${DB_URI} ...`);
  });
};

export default initDB;
