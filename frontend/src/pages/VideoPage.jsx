// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import VideoPlayer from '../components/VideoPlayer';

// function VideoPage() {
//   const { videoId } = useParams();
//   const [video, setVideo] = useState(null);

//   const videoList = [
//     { id: '1', title: 'Introduction to React', url: '/video1.mp4', duration: 300 },
//     { id: '2', title: 'Advanced JavaScript', url: '/video2.mp4', duration: 400 },
//     { id: '3', title: 'Node.js Basics', url: '/video3.mp4', duration: 350 },
//     { id: '4', title: 'MongoDB Essentials', url: '/video4.mp4', duration: 320 },
//   ];

//   useEffect(() => {
//     const fetchProgress = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`http://localhost:5000/api/progress/${videoId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const selectedVideo = videoList.find((v) => v.id === videoId);
//         setVideo({
//           ...selectedVideo,
//           progress: res.data.progress || 0,
//           intervals: res.data.intervals || [],
//           lastPosition: res.data.lastPosition || 0,
//         });
//       } catch (err) {
//         const selectedVideo = videoList.find((v) => v.id === videoId);
//         setVideo({ ...selectedVideo, progress: 0, intervals: [], lastPosition: 0 });
//       }
//     };
//     fetchProgress();
//   }, [videoId]);

//   if (!video) return <div>Loading...</div>;

//   return (
//     <div className="flex-grow bg-gray-100">
//       <h2 className="text-3xl font-bold text-center p-6">{video.title}</h2>
//       <VideoPlayer
//         videoId={video.id}
//         videoUrl={video.url}
//         duration={video.duration}
//         initialProgress={video.progress}
//         initialIntervals={video.intervals}
//         lastPosition={video.lastPosition}
//       />
//     </div>
//   );
// }

// export default VideoPage;
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';

function VideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  const videoList = [
    { id: '1', title: 'Introduction to React', url: '/video1.mp4', duration: 300 },
    { id: '2', title: 'Advanced JavaScript', url: '/video2.mp4', duration: 400 },
    { id: '3', title: 'Node.js Basics', url: '/video3.mp4', duration: 350 },
    { id: '4', title: 'MongoDB Essentials', url: '/video4.mp4', duration: 320 },
  ];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/progress/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const selectedVideo = videoList.find((v) => v.id === videoId);
        setVideo({
          ...selectedVideo,
          progress: res.data.progress || 0,
          intervals: res.data.intervals || [],
          lastPosition: res.data.lastPosition || 0,
        });
      } catch (err) {
        const selectedVideo = videoList.find((v) => v.id === videoId);
        setVideo({ ...selectedVideo, progress: 0, intervals: [], lastPosition: 0 });
      }
    };
    fetchProgress();
  }, [videoId]);

  if (!video) return <div className="text-center p-6 text-gray-600">Loading video...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold">{video.title}</h2>
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>

        <VideoPlayer
          videoId={video.id}
          videoUrl={video.url}
          duration={video.duration}
          initialProgress={video.progress}
          initialIntervals={video.intervals}
          lastPosition={video.lastPosition}
        />
      </div>
    </div>
  );
}

export default VideoPage;
