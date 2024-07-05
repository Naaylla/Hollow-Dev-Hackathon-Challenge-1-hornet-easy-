const express = require('express');
const fs = require('fs');
const path = require('path');
const fileModel = require('../models/fileModel');

const router = express.Router();

router.delete("/file/:id", async (request, response) => {
    try {
        const file = await fileModel.findById(request.params.id);
        if (!file) {
            return response.status(404).send('File not found');
        }

        const filepath = path.join(__dirname, '../files', file.name);
        fs.unlink(filepath, async (err) => {
            if (err) {
                return response.status(500).send('Could not delete the file');
            }

            await fileModel.findByIdAndDelete(request.params.id);
            response.send('File deleted successfully');
        });
    } catch (error) {
        response.status(500).send('Server error');
    }
});

module.exports = router;
