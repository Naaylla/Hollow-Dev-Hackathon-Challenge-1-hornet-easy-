const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./config/database");
const fileModel = require("./models/fileModel");
const mongoose = require('mongoose');

dotenv.config();

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.mp4']),
    fileSizeLimiter,
    async (req, res) => {
        const files = req.files;
        const fileInfos = await Promise.all(Object.keys(files).map(async (key) => {
            const filepath = path.join(__dirname, 'files', files[key].name);

            await files[key].mv(filepath);

            console.log(files[key])

            const { name, data, size, encoding, tempFilePath, truncated, mimetype, md5, mv } = files[key];

            fileModel.create({
                _id: new mongoose.Types.ObjectId(),
                name,
                data,
                size,
                encoding,
                tempFilePath,
                truncated,
                mimetype,
                md5
            });

        }));

        return res.json({ status: 'Uploaded succesfully', message: Object.keys(files).toString() })
    }
);

const PORT = 5000;

async function start() {
    await connectToDB(process.env.DATABASE_URL);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}

start();
