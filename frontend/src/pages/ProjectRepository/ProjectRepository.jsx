import { useState } from 'react';
import { Save, CheckCircle, Briefcase, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectRepository() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technology: [],
    difficulty: 'Intermediate',
    estimatedHours: 0,
    githubUrl: '',
    flowDiagram: '',
    architecture: ''
  });
  const [currentTech, setCurrentTech] = useState('');
  const [saved, setSaved] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTech = (e) => {
    if (e.key === 'Enter' && currentTech.trim()) {
      e.preventDefault();
      if (!formData.technology.includes(currentTech.trim())) {
        setFormData(prev => ({
          ...prev,
          technology: [...prev.technology, currentTech.trim()]
        }));
      }
      setCurrentTech('');
    }
  };

  const removeTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technology: prev.technology.filter(t => t !== techToRemove)
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ name: '', description: '', technology: [], difficulty: 'Intermediate', estimatedHours: 0, githubUrl: '', flowDiagram: '', architecture: '' });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <Briefcase size={36} className="text-cyan-500" />
            Project Repository
          </h1>
          <p className="text-slate-400">Store full-stack, frontend, and backend projects for students</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Project'}
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. E-Commerce Platform"
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                placeholder="https://github.com/..."
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Project Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="What does this project do?"
              className="w-full min-h-[100px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Technologies (Stack)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.technology.map(tech => (
                  <span key={tech} className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full text-sm">
                    {tech}
                    <button onClick={() => removeTech(tech)} className="hover:text-cyan-200 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-cyan-500 transition-all px-3">
                <Tag size={18} className="text-slate-400" />
                <input
                  type="text"
                  value={currentTech}
                  onChange={(e) => setCurrentTech(e.target.value)}
                  onKeyDown={addTech}
                  placeholder="Type tech and press Enter (e.g. React)"
                  className="w-full p-3 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Flow Diagram (Markdown/URL)</label>
              <textarea
                value={formData.flowDiagram}
                onChange={(e) => handleInputChange('flowDiagram', e.target.value)}
                placeholder="User flows..."
                className="w-full min-h-[120px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-y text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Architecture Details</label>
              <textarea
                value={formData.architecture}
                onChange={(e) => handleInputChange('architecture', e.target.value)}
                placeholder="System architecture..."
                className="w-full min-h-[120px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all resize-y text-sm font-mono"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
