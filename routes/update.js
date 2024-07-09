const express = require("express");
const fileModel = require("../models/fileModel");
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

    const file = await fileModel.findByIdAndUpdate(id, request.body);

    if (!file) {
      return response.status(404).json({ message: "file not found" });
    }

    const updatedFile = await file.findById(id);
    response.status(200).json(updatedFile);
  } catch (error) {
    response.status(500).json({ messege: error.message });
  }
});



// GET endpoint to provide instructions for updating or downloading a file
router.get("/", (request, response) => {
  response.json({
    message:
      "To update your information or download a file, please use Postman.",
    instructions: [
      "Specify the ID in the path as follows: update/:id",
      "Update your request body with JSON in the following format:",
      {
        name: "",
        path: "",
        size: "",
        encoding: "",
        mimetype: "",
        md5: "",
        truncated: "",
        __v: "",
      },
    ],
  });
});

router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const file = await fileModel.findByIdAndUpdate(id, request.body);

    if (!file) {
      return response.status(404).json({ message: "file not found" });
    }

    const updatedFile = await fileModel.findById(id);
    response.status(200).json(updatedFile);
  } catch (error) {
    response.status(500).json({ messege: error.message });
  }
});

module.exports = router;
