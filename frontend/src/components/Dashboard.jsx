
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaClock, FaPlay } from 'react-icons/fa';

function Dashboard() {
  const [videos, setVideos] = useState([]);

  const videoList = [
    { id: '1', title: 'Introduction to React', url: '/video1.mp4' },
    { id: '2', title: 'Advanced JavaScript', url: '/video2.mp4' },
    { id: '3', title: 'Node.js Basics', url: '/video3.mp4' },
    { id: '4', title: 'MongoDB Essentials', url: '/video4.mp4' },
  ];

  const getVideoDuration = (url) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;
      video.onloadedmetadata = () => resolve(video.duration);
      video.onerror = () => resolve(0);
    });
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/progress', {
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Your Dashboard
      </h2>

      <div className="flex justify-end mb-6">
        <Link
          to="/analytics"
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 shadow-md transition"
        >
          View Analytics
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>

            <div className="mb-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${video.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span className="font-medium">{Math.round(video.progress)}% complete</span>
                <span className="flex items-center gap-1">
                  <FaClock className="text-blue-500" />
                  {(video.duration / 60).toFixed(1)} min
                </span>
              </div>
            </div>

            <Link
              to={`/video/${video.id}`}
              className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition"
            >
              <FaPlay />
              Watch Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;