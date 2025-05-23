import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to LearnTrack</h1>
        <p className="text-lg mb-6">Track your learning progress with precision!</p>
        <Link
          to="/dashboard"
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
            Start Learning
        </Link>
      </div>
    </div>
  );
}

export default Home;