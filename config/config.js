const config = {
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/fitness-db",
  PORT: process.env.PORT || 3000,
};

export default config; // Change to default export
