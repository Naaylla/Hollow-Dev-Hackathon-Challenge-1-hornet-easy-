const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    data: { type: Buffer },
    size: { type: Number, required: true },
    encoding: { type: String, required: true },
    tempFilePath: { type: String, default: '' },
    truncated: { type: Boolean, required: true },
    mimetype: { type: String, required: true },
    md5: { type: String, required: true }
});

const fileModel = mongoose.model('File', fileSchema);

module.exports = fileModel;
