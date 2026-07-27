import { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, Code, BookOpen, Lightbulb, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeachingAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('detailedAnswer');

  const askAssistant = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch('http://localhost:5000/api/assistant/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'shortAnswer', icon: <Sparkles size={16}/>, label: 'Quick' },
    { id: 'detailedAnswer', icon: <BookOpen size={16}/>, label: 'Detailed' },
    { id: 'analogy', icon: <Lightbulb size={16}/>, label: 'Analogy' },
    { id: 'code', icon: <Code size={16}/>, label: 'Code' },
    { id: 'interviewVersion', icon: <Users size={16}/>, label: 'Interview' }
  ];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-[#FF5D73] text-white rounded-full shadow-lg shadow-[#FF5D73]/30 hover:scale-110 transition-transform z-50"
      >
        <MessageCircle size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-[450px] bg-[#0a0a0a] border border-[#494949] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b border-[#494949] bg-[#141414]"
>
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Sparkles className="text-[#FF5D73]" size={20}/> Live Teaching Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-[#7C7A7A] hover:text-white transition-colors"><X size={20}/></button>
            </div>

            <div className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto flex flex-col gap-4"
>
              {response ? (
                <div className="flex flex-col h-full"
>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2"
>
                    {tabs.map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-[#FF5D73] text-white' : 'bg-[#141414] text-[#7C7A7A] hover:text-white'}`}
                      >
                        {tab.icon} {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 bg-[#141414] rounded-lg p-4 text-white text-sm leading-relaxed whitespace-pre-wrap border border-[#494949]"
>
                    {response[activeTab] || 'Not available.'}
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex-1 flex items-center justify-center text-[#7C7A7A] animate-pulse"
>
                  Analyzing knowledge base...
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#7C7A7A] text-center px-8"
>
                  Ask a question a student just asked, and I'll find the perfect answer based on your notes.
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#494949] bg-[#141414] flex gap-2"
>
              <input 
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAssistant()}
                placeholder="e.g., Why do we use Redux?"
                className="flex-1 bg-[#0a0a0a] border border-[#494949] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FF5D73]"
              />
              <button 
                onClick={askAssistant}
                disabled={isLoading || !question.trim()}
                className="p-2 bg-[#FF5D73] text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
