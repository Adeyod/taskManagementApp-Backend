import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DBConfig = mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(
      `MongoDB Connected successfully to the database on ${mongoose.connection.host}`
    );
  })
  .catch((error) => {
    console.log(error);
  });

export default DBConfig;
