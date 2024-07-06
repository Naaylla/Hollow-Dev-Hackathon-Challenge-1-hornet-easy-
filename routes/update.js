const express = require('express');
const fileModel = require('../models/fileModel');

const router = express.Router();


// GET endpoint to provide instructions for updating or downloading a file
router.get("/", (request, response) => {
    response.json({
        message: "To update your information or download a file, please use Postman.",
        instructions: [
            "Specify the ID in the path as follows: update/info/:id",
            "Update your request body with JSON in the following format:",
            {
                name: "",
                path: "",
                size: "",
                encoding: "",
                mimetype: "",
                md5: "",
                truncated: "",
                __v: ""
            }
        ]
    });
});


router.put("/:id", async (request, response) => {
    try {
        const { id } = request.params;
        const updateFields = { ...request.body };

        // Remove sensitive fields that shouldn't be updated
        delete updateFields.__v;
        delete updateFields.truncated;
        delete updateFields.tempFilePath;
        delete updateFields.size;

        const updatedFile = await fileModel.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedFile) {
            return response.status(404).json({ message: "File does not exist." });
        }

        const file = await fileModel.findById(id);

        response.status(200).json(file);

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});


module.exports = router;
