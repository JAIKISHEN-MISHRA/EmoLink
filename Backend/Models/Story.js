import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegisteredUser', // Reference to the User model
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Story = mongoose.model('Story', storySchema);

export default Story;
