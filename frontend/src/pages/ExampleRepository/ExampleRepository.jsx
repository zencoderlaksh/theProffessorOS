import { useState } from 'react';
import { Save, CheckCircle, Database, Plus, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExampleRepository() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
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
      const response = await fetch('http://localhost:5000/api/examples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        // Clear form after save
        setFormData({ title: '', description: '', content: '', relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving example:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#FFFFFF] mb-2 tracking-tight flex items-center gap-3">
            <Database size={36} className="text-[#FF5D73]" />
            Example Repository
          </h1>
          <p className="text-[#7C7A7A]">Create reusable examples that appear everywhere</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#FF5D73] hover:bg-[#ff405b] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#FF5D73]/20"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Example'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10"
      >
        <div className="flex flex-col gap-8">
          
          <div>
            <label className="block text-base font-semibold text-[#FFFFFF] mb-3">Example Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. ATM, Library Management"
              className="w-full p-4 bg-[#0a0a0a] border border-[#494949] rounded-xl text-[#FFFFFF] placeholder-[#7C7A7A] focus:outline-none focus:border-[#FF5D73] transition-all text-xl font-bold"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-[#FFFFFF] mb-3">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the example scenario"
              className="w-full p-4 bg-[#0a0a0a] border border-[#494949] rounded-xl text-[#FFFFFF] placeholder-[#7C7A7A] focus:outline-none focus:border-[#FF5D73] transition-all text-lg"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-[#FFFFFF] mb-3">Used In (Subjects / Topics)</label>
            <div className="flex flex-wrap gap-3 mb-4">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-2 px-4 py-2 bg-[#FF5D73]/20 text-[#FF5D73] border border-[#FF5D73]/30 rounded-full text-base font-medium">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-[#0a0a0a] border border-[#494949] rounded-xl focus-within:border-[#FF5D73] transition-all px-4 py-2">
              <Tag size={20} className="text-[#7C7A7A]" />
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type and press Enter to add (e.g. Java OOP, Classes)"
                className="w-full p-3 bg-transparent text-[#FFFFFF] placeholder-[#7C7A7A] focus:outline-none text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-[#FFFFFF] mb-3">Detailed Content (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write the full example content here..."
              className="w-full min-h-[400px] p-5 bg-[#0a0a0a] border border-[#494949] rounded-xl text-[#FFFFFF] placeholder-[#7C7A7A] focus:outline-none focus:border-[#FF5D73] transition-all resize-y text-lg"
            />
          </div>

        </div>
      </motion.div>
    </div>
  );
}
