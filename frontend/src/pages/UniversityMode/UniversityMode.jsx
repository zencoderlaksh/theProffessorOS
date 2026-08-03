import React, { useState } from 'react';
import axios from 'axios';

const UniversityMode = () => {
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateMaterial = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/university', { semester, subject });
      setMaterial(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">University Mode</h1>
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          placeholder="e.g., BCA Semester 4"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex-1 border border-gray-700"
        />
        <input 
          type="text" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Operating Systems"
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex-1 border border-gray-700"
        />
        <button 
          onClick={generateMaterial}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Prep Material'}
        </button>
      </div>

      {material && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Exam Prep Material</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-indigo-400">Important Questions</h3>
              <ul className="list-disc pl-5">
                {material.importantQuestions?.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-400">Assignments</h3>
              <ul className="list-disc pl-5">
                {material.assignments?.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityMode;
