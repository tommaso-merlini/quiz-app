import "dotenv/config";
const env = process.env.NODE_ENV;

export const getApiUrl = () => {
  if (env === "production") {
    return "http://slaytest-api.railway.internal:3000";
  }

  return "http://localhost:3000";
};
