import cron from 'node-cron';
import Story from '../Models/Story.js';

// Define a cron job to run every hour
const storyCleanUpJob=cron.schedule('0 * * * *', async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deletedStories = await Story.deleteMany({ expiryDate: { $lt: twentyFourHoursAgo } });

    console.log(`Deleted ${deletedStories.deletedCount} expired stories.`);
  } catch (error) {
    console.error('Error deleting expired stories:', error);
  }
});
export default storyCleanUpJob;
