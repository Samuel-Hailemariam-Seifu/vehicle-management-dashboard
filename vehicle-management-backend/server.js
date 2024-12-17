const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const vehicleRoutes = require("./routes/vehicles");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/vehicles", vehicleRoutes);

// MongoDB connection options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increased timeout to 30s
  retryWrites: true,
};

// Connect to MongoDB with retry mechanism
const connectWithRetry = async (retries = 5, interval = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/vehicle-management", // Using IP instead of localhost
        mongooseOptions
      );
      console.log("Connected to MongoDB");
      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`Retrying in ${interval/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }
  return false;
};

// Start server only after successful DB connection
const startServer = async () => {
  const isConnected = await connectWithRetry();
  
  if (!isConnected) {
    console.error("Failed to connect to MongoDB after multiple retries");
    process.exit(1);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Handle unexpected errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Give the server time to log the error before exiting
  setTimeout(() => process.exit(1), 1000);
});

startServer();
