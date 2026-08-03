import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [teachingStyle, setTeachingStyle] = useState('');
  const [aiMemory, setAiMemory] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ai/profile');
      setTeachingStyle(res.data.teachingStyle || '');
      setAiMemory(res.data.aiMemory || []);
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfile = async () => {
    try {
      await axios.put('http://localhost:5000/api/ai/profile', { teachingStyle, aiMemory });
      alert('Settings saved!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 text-white h-full">
      <h1 className="text-3xl font-bold mb-6">AI Settings (Module 13 & 20)</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Personal Teaching Style</h2>
          <p className="text-gray-400 text-sm mb-4">How should the AI explain concepts?</p>
          <textarea 
            value={teachingStyle}
            onChange={(e) => setTeachingStyle(e.target.value)}
            className="bg-gray-800 text-white w-full px-4 py-2 rounded-lg border border-gray-700 h-32"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">AI Memory</h2>
          <p className="text-gray-400 text-sm mb-4">Things the AI has learned about you.</p>
          <ul className="list-disc pl-5 text-gray-300">
            {aiMemory.map((mem, i) => <li key={i}>{mem}</li>)}
            {aiMemory.length === 0 && <li>Nothing learned yet.</li>}
          </ul>
        </div>
        
        <button 
          onClick={saveProfile}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
