"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    video_url: {
        type: String,
        required: true,
    },
    module_number: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
exports.Module = (0, mongoose_1.model)('Module', moduleSchema);
