const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    path: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);
