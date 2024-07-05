const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const dotenv = require("dotenv");
const connectToDb = require("./config/database")

dotenv.config()

const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const app = express();

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.mp4']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files
        console.log(files) // those info should be stored in a database

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({ status: 'Uploaded succesfully', message: Object.keys(files).toString() })
    }
)

async function start() {
    await connectToDb(process.env.DATABASE_URL)
}

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));