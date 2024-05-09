import mongoose from "mongoose";

interface ConnectionOptions {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connnect({ dbName, mongoUrl }: ConnectionOptions) {
    try {
      await mongoose.connect(mongoUrl, { dbName });
      return true
    } catch (error) {
      console.log("Mongo connection error");
      throw error;
    }
  }
}
