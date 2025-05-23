import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaPlayCircle, FaPercentage } from 'react-icons/fa';

function Analytics() {
  const [videos, setVideos] = useState([]);

  const videoList = [
    { id: '2', title: 'Advanced JavaScript', url: '/video2.mp4' },
    { id: '3', title: 'Node.js Basics', url: '/video3.mp4' },
    { id: '4', title: 'MongoDB Essentials', url: '/video4.mp4' },
  ];

  const getVideoDuration = (url) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = () => resolve(0);
    });
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://stream-backend-w52k.onrender.com/api/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const progressMap = {};
        res.data.forEach((p) => {
          progressMap[p.videoId] = p;
        });

        const durations = await Promise.all(
          videoList.map((video) => getVideoDuration(video.url))
        );

        const updatedVideos = videoList.map((video, idx) => {
          const intervals = progressMap[video.id]?.intervals || [];
          const watchedSeconds = intervals.reduce(
            (sum, [start, end]) => sum + (end - start),
            0
          );
          const duration = durations[idx] || 1;
          let progress = (watchedSeconds / duration) * 100;
          progress = Math.min(progress, 100);

          return {
            ...video,
            duration: Math.round(duration),
            progress,
            intervals,
          };
        });

        setVideos(updatedVideos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProgress();
  }, []);

  const overallCompletion =
    videos.length > 0
      ? Math.round(
          videos.reduce((sum, v) => sum + (v.progress || 0), 0) / videos.length
        )
      : 0;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Analytics</h2>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">Overall Completion</span>
          <span className="text-lg font-bold text-blue-700">{overallCompletion}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-5 transition-all duration-500"
            style={{ width: `${overallCompletion}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{video.title}</h3>
              <Link
                to={`/video/${video.id}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700"
              >
                <FaPlayCircle className="text-white" />
                Continue Watching
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                Duration: {(video.duration / 60).toFixed(1)} min
              </div>
              <div className="flex items-center gap-2">
                <FaPercentage className="text-green-500" />
                Progress: {Math.round(video.progress)}%
              </div>
              <div className="flex items-center gap-2">
                🧩 Intervals Watched: {video.intervals.length}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-700 font-medium mb-2">Watched Segments:</p>
              {video.intervals.length ? (
                <div className="flex flex-wrap gap-2">
                  {video.intervals.map(([start, end], index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-900 text-xs font-semibold px-3 py-1 rounded-full shadow"
                    >
                      {(start / 60).toFixed(1)} - {(end / 60).toFixed(1)} min
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic mb-2">No segments watched yet</p>
              )}
            </div>

            <div className="mt-4 w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-4 transition-all duration-500"
                style={{ width: `${video.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Analytics;
