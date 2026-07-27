import { useState } from 'react';
import { Save, CheckCircle, HelpCircle, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuestionBank() {
  const [formData, setFormData] = useState({
    text: '',
    type: 'Interview Questions',
    answer: '',
    relatedTopics: []
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
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ text: '', type: 'Interview Questions', answer: '', relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving question:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <HelpCircle size={36} className="text-rose-500" />
            Question Bank
          </h1>
          <p className="text-slate-400">Store university questions, interview FAQs, and MCQs</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-rose-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Question'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-xl border border-slate-700/50 bg-slate-900/40"
      >
        <div className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category / Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-rose-500 transition-all"
            >
              <option value="University Questions">University Questions</option>
              <option value="Previous Papers">Previous Papers</option>
              <option value="Frequently Asked">Frequently Asked</option>
              <option value="Interview Questions">Interview Questions</option>
              <option value="MCQs">MCQs</option>
              <option value="Coding Problems">Coding Problems</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Question Text</label>
            <textarea
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="e.g. What is the difference between let and var?"
              className="w-full min-h-[100px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all resize-y text-lg font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Ideal Answer / Solution</label>
            <textarea
              value={formData.answer}
              onChange={(e) => handleInputChange('answer', e.target.value)}
              placeholder="Provide the explanation or solution..."
              className="w-full min-h-[150px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Topics</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-rose-200 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-rose-500 transition-all px-3">
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
