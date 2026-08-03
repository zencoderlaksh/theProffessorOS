import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SmartEditor = () => {
  const [draft, setDraft] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  
  // Dummy available resources
  const availableResources = [
    { id: '1', title: 'React Hooks Example' },
    { id: '2', title: 'TodoList Project' },
    { id: '3', title: 'React State MCQ' }
  ];

  // Debounced Recommendation Fetch
  useEffect(() => {
    const handler = setTimeout(() => {
      if (draft.length > 10) {
        axios.post('http://localhost:5000/api/ai/recommendations', { 
          draftText: draft, 
          availableResources 
        })
        .then(res => setRecommendations(res.data.recommendations || []))
        .catch(err => console.error(err));
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [draft]);

  return (
    <div className="flex h-[500px] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-8 text-white">
      <div className="flex-1 p-4">
        <h3 className="font-bold mb-4">Smart Editor</h3>
        <textarea
          className="w-full h-full bg-transparent outline-none resize-none"
          placeholder="Start writing your lesson..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      </div>
      <div className="w-64 bg-gray-800 p-4 border-l border-gray-700">
        <h3 className="font-bold text-[#FF5D73] mb-4">AI Suggestions</h3>
        {recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.map(id => {
              const res = availableResources.find(r => r.id === id);
              return res ? (
                <li key={id} className="bg-gray-700 p-2 rounded text-sm cursor-pointer hover:bg-gray-600 transition-colors">
                  + Add {res.title}
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">Keep writing for suggestions...</p>
        )}
      </div>
    </div>
  );
};

export default SmartEditor;
