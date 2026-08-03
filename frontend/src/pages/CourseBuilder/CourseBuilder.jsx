import React, { useState } from 'react';
import axios from 'axios';

const CourseBuilder = () => {
  const [techStack, setTechStack] = useState('');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateCourse = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/course', { techStack });
      setCourse(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">AI Course Builder</h1>
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="e.g., React, Node, MongoDB"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex-1 border border-gray-700"
        />
        <button 
          onClick={generateCourse}
          className="bg-[#FF5D73] text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          {loading ? 'Building...' : 'Build Course'}
        </button>
      </div>

      {course && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
          <div className="space-y-6">
            {course.weeks?.map((week, i) => (
              <div key={i} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-[#FF5D73] mb-2">Week {week.weekNumber}: {week.title}</h3>
                <p><strong>Topics:</strong> {week.topics?.join(', ')}</p>
                <p><strong>Projects:</strong> {week.projects?.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilder;
