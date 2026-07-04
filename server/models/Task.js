import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true
    },
    deadline: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    category: {
      type: String,
      default: '',
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date,
      default: null
    },
    notifiedOverdue: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model('Task', taskSchema)
