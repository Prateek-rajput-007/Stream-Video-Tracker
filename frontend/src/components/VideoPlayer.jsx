
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function VideoPlayer({ videoId, videoUrl, duration: initialDuration, initialProgress, initialIntervals, lastPosition }) {
  const [progress, setProgress] = useState(initialProgress || 0);
  const [intervals, setIntervals] = useState(initialIntervals || []);
  const [duration, setDuration] = useState(initialDuration || 1);
  const [notes, setNotes] = useState(() => localStorage.getItem(`notes_${videoId}`) || '');
  const videoRef = useRef(null);
  const lastUpdate = useRef(0);
  const lastReported = useRef(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = lastPosition || 0;
      lastUpdate.current = lastPosition || 0;
      lastReported.current = lastPosition || 0;
    }
  }, [lastPosition]);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (videoRef.current && videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    };
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      if (video.duration) setDuration(video.duration);
    }
    return () => {
      if (video) video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl]);

  const mergeIntervals = (intervals) => {
    if (!intervals.length) return [];
    const sorted = intervals.sort((a, b) => a[0] - b[0]);
    const merged = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      const current = sorted[i];
      if (current[0] <= last[1]) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }
    }
    return merged;
  };

  const calculateProgress = (mergedIntervals, dur) => {
    const totalWatched = mergedIntervals.reduce((sum, [start, end]) => sum + (end - start), 0);
    return Math.min((totalWatched / dur) * 100, 100);
  };

  const handleTimeUpdate = async () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;

    if (currentTime > lastUpdate.current && currentTime - lastUpdate.current < 2) {
      if (currentTime - lastReported.current >= 1) {
        const newInterval = [Math.floor(lastReported.current), Math.floor(currentTime)];
        const newIntervals = mergeIntervals([...intervals, newInterval]);
        const newProgress = calculateProgress(newIntervals, duration);
        setIntervals(newIntervals);
        setProgress(newProgress);
        lastReported.current = currentTime;

        try {
          const token = localStorage.getItem('token');
          await axios.post(
            'http://localhost:5000/api/progress',
            { videoId, intervals: newIntervals, progress: newProgress, lastPosition: currentTime },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err) {
          console.error(err);
        }
      }
    }
    lastUpdate.current = currentTime;
  };

  const handleSeeked = () => {
    if (videoRef.current) {
      lastUpdate.current = videoRef.current.currentTime;
      lastReported.current = videoRef.current.currentTime;
    }
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setNotes(value);
    localStorage.setItem(`notes_${videoId}`, value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-2 space-y-4">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleSeeked}
          className="w-full rounded-lg shadow-lg"
        />

        <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-sm text-center text-gray-600 font-medium">
          {Math.round(Math.min(progress, 100))}% Complete
        </p>
      </div>

      {/* Notes Panel */}
      <div className="bg-white rounded-lg shadow-md p-4 sticky top-6 h-fit">
        <h3 className="text-lg font-semibold mb-2">Your Notes</h3>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          rows={10}
          className="w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your notes while watching..."
        />
      </div>
    </div>
  );
}

export default VideoPlayer;
