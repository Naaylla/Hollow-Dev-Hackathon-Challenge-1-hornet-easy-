const express = require('express');
const path = require('path');
const fileModel = require('../models/fileModel');

const router = express.Router();

router.get("/", (request, response) => {
    response.json("To retrieve your file or you file informations, please specify the ID in the path as follows: download/info/:id or download/file/:id");
});

router.get("/info/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const fileInfo = await fileModel.findById(id);
        response.status(200).json(fileInfo);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get("/file/:id", async (request, response) => {
    try {
        const file = await fileModel.findById(request.params.id);
        if (!file) {
            return response.status(404).send('File not found');
        }

        const filepath = path.join(__dirname, '../files', file.name);
        response.download(filepath, file.name, (err) => {
            if (err) {
                return response.status(500).send('Could not download the file');
            }
        });
    } catch (error) {
        response.status(500).send('Server error');
    }
});

module.exports = router;
