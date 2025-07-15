import { Schema, model } from 'mongoose';
import { TModule } from './module.interface';

const moduleSchema = new Schema<TModule>(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export const Module = model<TModule>('Module', moduleSchema);