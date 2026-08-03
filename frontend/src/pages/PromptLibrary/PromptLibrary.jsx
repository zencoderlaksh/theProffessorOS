import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromptLibrary = () => {
  const [prompts, setPrompts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ai/prompts');
      setPrompts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const savePrompt = async () => {
    try {
      await axios.post('http://localhost:5000/api/ai/prompts', { title, content });
      setTitle('');
      setContent('');
      fetchPrompts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 text-white h-full">
      <h1 className="text-3xl font-bold mb-6">Prompt Library</h1>
      
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold mb-4">Create New Prompt</h2>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Explain for Beginners"
          className="bg-gray-800 text-white w-full px-4 py-2 rounded-lg border border-gray-700 mb-4"
        />
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Prompt content..."
          className="bg-gray-800 text-white w-full px-4 py-2 rounded-lg border border-gray-700 mb-4 h-32"
        />
        <button 
          onClick={savePrompt}
          className="bg-[#2DCC70] text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Prompt
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map(prompt => (
          <div key={prompt._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold text-[#FF5D73] mb-2">{prompt.title}</h3>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{prompt.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptLibrary;
