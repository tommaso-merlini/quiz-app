import "dotenv/config";
const env = process.env.NODE_ENV;

export const getApiUrl = () => {
  if (env === "production") {
    return "https://slaytest-api-production.up.railway.app";
  }

  return "http://localhost:3000";
};
