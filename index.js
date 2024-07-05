const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./config/database");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Route imports
const uploadRoutes = require('./routes/upload');
const downloadRoutes = require('./routes/download');
const updateRoutes = require('./routes/update');
const deleteRoutes = require('./routes/delete');

// Route middlewares
app.use("/upload", uploadRoutes);
app.use("/download", downloadRoutes);
app.use("/update", updateRoutes);
app.use("/delete", deleteRoutes);

const PORT = 5000;

async function start() {
    await connectToDB(process.env.DATABASE_URL);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

start();
