import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  'Core Concepts',
  'Technical',
  'Examples',
  'Guidelines',
  'Assessment',
  'Wrap-up'
];

const FIELDS = {
  'Core Concepts': ['definition', 'whyWeNeedIt', 'problemItSolves', 'realWorldAnalogy', 'theory'],
  'Technical': ['syntax', 'parameters', 'lifecycle', 'flowDiagram', 'executionSteps', 'visualExplanation'],
  'Examples': ['basicExample', 'intermediateExample', 'advancedExample', 'industryExample'],
  'Guidelines': ['bestPractices', 'commonMistakes'],
  'Assessment': ['interviewQuestions', 'assignments', 'lab', 'practiceQuestions', 'mcqs'],
  'Wrap-up': ['summary', 'revisionNotes', 'references']
};

// Map camelCase to Title Case for labels
const formatLabel = (field) => {
  const result = field.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function LessonBuilder() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [formData, setFormData] = useState({});
  const [saved, setSaved] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving lesson:', err);
    }
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState('');

  const handleGenerate = async () => {
    if (!topicPrompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:5000/api/lectures/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicPrompt })
      });
      if (response.ok) {
        const data = await response.json();
        const plan = data.plan;
        
        // Map the generated plan to our formData fields
        setFormData(prev => ({
          ...prev,
          definition: plan.objectives ? plan.objectives.join('\n') : '',
          theory: plan.theory || '',
          whyWeNeedIt: plan.introduction || '',
          basicExample: plan.examples ? plan.examples.join('\n') : '',
          codingDemo: plan.codingDemo || '',
          practiceQuestions: plan.practice ? plan.practice.join('\n') : '',
          assignments: plan.assignment || '',
          homework: plan.homework || '',
          interviewQuestions: plan.interviewQuestions ? plan.interviewQuestions.join('\n') : '',
          summary: plan.summary || ''
        }));
        alert("Lecture generated successfully!");
      }
    } catch (err) {
      console.error('Generation error:', err);
      alert('Failed to generate lesson.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Lesson Builder</h1>
          <p className="text-[#7C7A7A]">Create the Golden Template for your topic</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF5D73] hover:bg-[#ff405b] text-white rounded-lg font-medium transition-colors shadow-lg shadow-[#FF5D73]/20"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Lesson'}
        </button>
      </header>

      <div className="glass-panel p-6 mb-8 flex items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#7C7A7A] mb-2">Generate Lesson with AI</label>
          <input 
            type="text" 
            value={topicPrompt}
            onChange={(e) => setTopicPrompt(e.target.value)}
            placeholder="e.g., React Hooks, Memory Management..."
            className="w-full bg-[#0a0a0a] border border-[#494949] rounded-lg px-4 py-3 text-[#FFFFFF] placeholder-[#7C7A7A] focus:outline-none focus:border-[#FF5D73]"
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !topicPrompt}
          className="px-6 py-3 bg-[#141414] hover:bg-[#494949] border border-[#494949] text-[#FFFFFF] rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : '✨ Generate'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-72 shrink-0">
          <div className="glass-panel p-6 flex flex-col gap-3 sticky top-8">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-5 py-4 rounded-xl transition-all font-medium text-base ${
                  activeTab === tab 
                    ? 'bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/30' 
                    : 'text-[#7C7A7A] hover:bg-[#141414] hover:text-[#FFFFFF]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass-panel p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-[#FFFFFF] mb-6 border-b border-[#494949] pb-4">
              {activeTab}
            </h2>
            
            <div className="flex flex-col gap-6">
              {FIELDS[activeTab].map(field => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#FFFFFF]">
                    {formatLabel(field)}
                  </label>
                  <textarea
                    value={formData[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={`Enter ${formatLabel(field)}... (Markdown supported)`}
                    className="w-full min-h-[150px] p-4 bg-[#0a0a0a] border border-[#494949] rounded-lg text-[#FFFFFF] placeholder-[#7C7A7A] focus:outline-none focus:border-[#FF5D73] focus:ring-1 focus:ring-[#FF5D73] transition-all resize-y"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
