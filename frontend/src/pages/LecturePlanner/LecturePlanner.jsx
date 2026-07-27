import { useState } from 'react';
import { Save, CheckCircle, Calendar, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LecturePlanner() {
  const [formData, setFormData] = useState({
    title: '',
    topicId: '',
    duration: 60,
    objectives: '',
    activities: '',
    homework: '',
    relatedTopics: [] // using tags for examples/assignments for simplicity here
  });
  const [currentTag, setCurrentTag] = useState('');
  const [saved, setSaved] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      const response = await fetch('http://localhost:5000/api/lectures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ title: '', topicId: '', duration: 60, objectives: '', activities: '', homework: '', relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving lecture:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <Calendar size={36} className="text-indigo-400" />
            Lecture Planner
          </h1>
          <p className="text-slate-400">Plan topics, duration, objectives, and activities</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Lecture'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-xl border border-slate-700/50 bg-slate-900/40"
      >
        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Lecture Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Introduction to React State"
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Duration (Minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Objectives</label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                placeholder="What should students learn?"
                className="w-full min-h-[150px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Activities</label>
              <textarea
                value={formData.activities}
                onChange={(e) => handleInputChange('activities', e.target.value)}
                placeholder="In-class activities..."
                className="w-full min-h-[150px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-y"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Homework / Assignments</label>
            <textarea
              value={formData.homework}
              onChange={(e) => handleInputChange('homework', e.target.value)}
              placeholder="Assigned homework..."
              className="w-full min-h-[100px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Topics / Examples</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-indigo-200 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-indigo-500 transition-all px-3">
              <Tag size={18} className="text-slate-400" />
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type tag (Topic, Example, Assignment) and press Enter"
                className="w-full p-3 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
