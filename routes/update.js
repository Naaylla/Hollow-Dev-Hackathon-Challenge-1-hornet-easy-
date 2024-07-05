const express = require('express');
const fileModel = require('../models/fileModel');

const router = express.Router();

router.post("/", (request, response) => {
    response.json("Please update your file by specifying the ID in the path as follows: /:id");
});

router.put("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const fileInfo = await fileModel.findByIdAndUpdate(id, request.body, { new: true });
        if (!fileInfo) {
            return response.status(404).json({ message: "File does not exist" });
        }
        response.status(200).json("File Info updated successfully");
    } catch (error) {
        response.status(500).json("Server error");
    }
});

module.exports = router;
