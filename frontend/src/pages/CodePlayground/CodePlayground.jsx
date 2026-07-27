import { useState } from 'react';
import { Save, CheckCircle, Code, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CodePlayground() {
  const [snippets, setSnippets] = useState([
    {
      code: '',
      language: 'javascript',
      difficulty: 'Beginner',
      expectedOutput: '',
      explanation: '',
      complexity: '',
      dryRun: '',
      isEditable: false,
      allowDownload: true,
      allowCopy: true
    }
  ]);
  const [saved, setSaved] = useState(false);

  const handleSnippetChange = (index, field, value) => {
    const newSnippets = [...snippets];
    newSnippets[index][field] = value;
    setSnippets(newSnippets);
  };

  const addSnippet = () => {
    setSnippets([
      ...snippets,
      {
        code: '',
        language: 'javascript',
        difficulty: 'Beginner',
        expectedOutput: '',
        explanation: '',
        complexity: '',
        dryRun: '',
        isEditable: false,
        allowDownload: true,
        allowCopy: true
      }
    ]);
  };

  const removeSnippet = (index) => {
    setSnippets(snippets.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippets: snippets.map(s => s.code), ...snippets[0] }), // Simplified for single doc test
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving snippet:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <Code size={36} className="text-blue-500" />
            Code Playground
          </h1>
          <p className="text-slate-400">Add interactive code snippets for this topic</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={addSnippet}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
          >
            <Plus size={18} /> Add Snippet
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30"
          >
            {saved ? <CheckCircle size={20} /> : <Save size={20} />}
            {saved ? 'Saved!' : 'Save All'}
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-8">
        {snippets.map((snippet, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-xl border border-slate-700/50 bg-slate-900/40 relative"
          >
            {snippets.length > 1 && (
              <button 
                onClick={() => removeSnippet(idx)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                <select 
                  value={snippet.language}
                  onChange={(e) => handleSnippetChange(idx, 'language', e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                <select 
                  value={snippet.difficulty}
                  onChange={(e) => handleSnippetChange(idx, 'difficulty', e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:ring-1 focus:ring-blue-500 outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Code Snippet</label>
              <textarea
                value={snippet.code}
                onChange={(e) => handleSnippetChange(idx, 'code', e.target.value)}
                placeholder="Write your code here..."
                className="w-full min-h-[200px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-green-400 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-y"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Expected Output</label>
                <textarea
                  value={snippet.expectedOutput}
                  onChange={(e) => handleSnippetChange(idx, 'expectedOutput', e.target.value)}
                  className="w-full min-h-[100px] p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all resize-y font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Dry Run / Execution Steps</label>
                <textarea
                  value={snippet.dryRun}
                  onChange={(e) => handleSnippetChange(idx, 'dryRun', e.target.value)}
                  className="w-full min-h-[100px] p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all resize-y"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Explanation</label>
                <textarea
                  value={snippet.explanation}
                  onChange={(e) => handleSnippetChange(idx, 'explanation', e.target.value)}
                  className="w-full min-h-[80px] p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Complexity</label>
                <input
                  type="text"
                  value={snippet.complexity}
                  onChange={(e) => handleSnippetChange(idx, 'complexity', e.target.value)}
                  placeholder="e.g. O(N) Time, O(1) Space"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-8 pt-4 border-t border-slate-700">
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={snippet.isEditable}
                  onChange={(e) => handleSnippetChange(idx, 'isEditable', e.target.checked)}
                  className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50 w-4 h-4"
                />
                Editable by students
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={snippet.allowDownload}
                  onChange={(e) => handleSnippetChange(idx, 'allowDownload', e.target.checked)}
                  className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50 w-4 h-4"
                />
                Allow Download
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={snippet.allowCopy}
                  onChange={(e) => handleSnippetChange(idx, 'allowCopy', e.target.checked)}
                  className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50 w-4 h-4"
                />
                Allow Copy
              </label>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
