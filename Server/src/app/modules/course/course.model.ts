import { Schema, model } from 'mongoose';
import { TCourse } from './course.interface';

const courseMediaSchema = new Schema({
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

const prerequisiteSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
});

const courseSchema = new Schema<TCourse>(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    moduleCount: {
      type: Number,
      default: 0,
    },
    modules: {
      type: [Schema.Types.ObjectId],
      ref: 'Module',
      default: [],
    },
    courseType: {
      type: String,
      enum: ['free', 'paid', 'subscription'],
      required: true,
    },
    courseGenre: {
      type: String,
      enum: ['HSC', 'Admission', 'Skill Development', 'Others'],
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
  },
  {
    timestamps: true,
  }
);

export const Course = model<TCourse>('Course', courseSchema);