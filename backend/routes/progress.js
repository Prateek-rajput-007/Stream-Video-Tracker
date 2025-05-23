const express = require('express');
const auth = require('../middleware/auth');
const VideoProgress = require('../models/VideoProgress');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const progress = await VideoProgress.find({ userId: req.user.userId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:videoId', auth, async (req, res) => {
  try {
    const progress = await VideoProgress.findOne({ userId: req.user.userId, videoId: req.params.videoId });
    if (!progress) return res.json({ progress: 0, intervals: [], lastPosition: 0 });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { videoId, intervals, progress, lastPosition } = req.body;
  try {
    let videoProgress = await VideoProgress.findOne({ userId: req.user.userId, videoId });
    if (videoProgress) {
      videoProgress.intervals = intervals;
      videoProgress.progress = progress;
      videoProgress.lastPosition = lastPosition;
    } else {
      videoProgress = new VideoProgress({
        userId: req.user.userId,
        videoId,
        intervals,
        progress,
        lastPosition,
      });
    }
    await videoProgress.save();
    res.json({ message: 'Progress saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;