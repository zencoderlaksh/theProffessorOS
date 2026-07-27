import { useState } from 'react';
import { Save, CheckCircle, PenTool, Tag, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AssignmentBuilder() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Theory',
    difficulty: 'Medium',
    content: '',
    relatedTopics: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [saved, setSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!topicPrompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicPrompt, contentType: formData.type })
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          title: `Generated ${formData.type} on ${topicPrompt}`,
          content: data.content
        }));
        alert("Content generated successfully!");
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert('Failed to generate content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.relatedTopics.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          relatedTopics: [...prev.relatedTopics, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      relatedTopics: prev.relatedTopics.filter(t => t !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ title: '', type: 'Theory', difficulty: 'Medium', content: '', relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving assignment:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <PenTool size={36} className="text-orange-500" />
            Assignment Builder
          </h1>
          <p className="text-slate-400">Design tests, labs, and theory assignments</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Assignment'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-xl border border-slate-700/50 bg-slate-900/40"
      >
        <div className="flex flex-col gap-6">

          {/* AI Generator Block */}
          <div className="bg-[#141414] p-6 rounded-lg border border-[#494949] flex items-end gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#7C7A7A] mb-2 flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF5D73]" /> Generate with AI
              </label>
              <input 
                type="text" 
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="e.g., React Hooks, pointers in C..."
                className="w-full bg-[#0a0a0a] border border-[#494949] rounded-lg px-4 py-3 text-white placeholder-[#7C7A7A] focus:outline-none focus:border-[#FF5D73]"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !topicPrompt}
              className="px-6 py-3 bg-[#FF5D73] hover:bg-[#ff405b] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : '✨ Generate'}
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Assignment Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. Build a Todo App"
              className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-all font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition-all"
              >
                <option value="Theory">Theory</option>
                <option value="Coding">Coding</option>
                <option value="Lab">Lab</option>
                <option value="Mini Project">Mini Project</option>
                <option value="Case Study">Case Study</option>
                <option value="MCQ">MCQ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500 transition-all"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Content (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Describe the assignment requirements..."
              className="w-full min-h-[250px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-all text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Topics</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-orange-200 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-orange-500 transition-all px-3">
              <Tag size={18} className="text-slate-400" />
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type tag and press Enter"
                className="w-full p-3 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
