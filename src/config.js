import dotenv from "dotenv";
dotenv.config();

export const IS_DEV = process.env.NODE_ENV === "development";
export const USE_MOCK_DATA = IS_DEV;
export const BASE_API_URL = IS_DEV
  ? "http://localhost:8080"
  : "https://f3mf794ytg.execute-api.us-east-1.amazonaws.com/dev";
