"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const courseMediaSchema = new mongoose_1.Schema({
    banner: {
        type: String,
        required: true,
    },
    intro_video: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
});
const prerequisiteSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
});
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    instructor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    students: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    moduleCount: {
        type: Number,
        default: 0,
    },
    modules: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Module',
        default: [],
    },
    courseType: {
        type: String,
        enum: ['free', 'paid', 'subscription'],
        required: true,
    },
    courseStatus: {
        type: String,
        enum: ['in-progress', 'completed', 'not-started'],
        default: 'not-started',
    },
    media: {
        type: courseMediaSchema,
        required: true,
    },
    prerequisites: {
        type: [prerequisiteSchema],
        default: [],
    },
    price: {
        type: Number,
        default: 0,
    },
    salePrice: {
        type: Number,
    },
    studentEnrolled: {
        type: Number,
        default: 0,
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
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
