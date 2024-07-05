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

app.get("/upload", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.post("/upload",
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.mp4']),
    fileSizeLimiter,
    async (req, res) => {
        const files = req.files;
        (Object.keys(files).map(async (key) => {
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


// retrieve info by id (the info is in the db)
app.get("/downloadInfo/:id", async function (request, reponse) {
    const { id } = request.params;

})


// update file info 

app.post("/update", function (request, response) {
    reponse.json("Update your file by citing /update/:id") // make this meaningful
})
app.put("/update", async function (request, reponse) {
    const { id } = request.params;
    const fileInfo = await fileModel.findByIdAndUpdate(id, request.body)
    if (!fileInfo) {
        return res.status(404).json({ message: "File does not exist" })
    }

    const updatedFileInfo = await fileModel.findById(id);
    res.status(200).json(`File Info updated succesfully ${id}`);
})


// retrieve file by id

app.get("/donwloadInfo")


// delete file by id

app.delete("/delete/:id", async function (request, response) {
    const { id } = request.params;

})

const PORT = 5000;

async function start() {
    await connectToDB(process.env.DATABASE_URL);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}

start();
