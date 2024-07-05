const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const mongoose = require('mongoose');
const fileModel = require('../models/fileModel');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');

const router = express.Router();

router.post("/",
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.mp4']),
    fileSizeLimiter,
    async (request, response) => {
        const files = request.files;
        await Promise.all(Object.keys(files).map(async (key) => {
            const filepath = path.join(__dirname, '../files', files[key].name);

            await files[key].mv(filepath);

            const { name, data, size, encoding, tempFilePath, truncated, mimetype, md5 } = files[key];

            await fileModel.create({
                _id: new mongoose.Types.ObjectId(),
                name,
                data,
                size,
                encoding,
                tempFilePath: filepath,
                truncated,
                mimetype,
                md5
            });
        }));

        return response.json({ status: 'Uploaded successfully', message: Object.keys(files).toString() });
    }
);

module.exports = router;
