import React, { useState, useEffect } from 'react';
import { 
  PenTool, Sparkles, Save, CheckCircle, Share2, Mail, MessageCircle, 
  Printer, Folder, Calendar, Award, Tag, X, BookOpen, Trash2, Eye, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function AssignmentBuilder() {
  const [activeTab, setActiveTab] = useState('builder'); // 'builder' | 'library'

  // Data State
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Theory',
    difficulty: 'Medium',
    courseId: '',
    totalMarks: 50,
    dueDate: '',
    content: '',
    relatedTopics: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI Generator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState('');

  // Modals & Active Action Items
  const [sharingAssignment, setSharingAssignment] = useState(null); // Assignment object selected for sharing
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [recipientEmails, setRecipientEmails] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // PDF Preview / Print Modal
  const [printAssignment, setPrintAssignment] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchAssignments();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
      if (res.data.length > 0 && !formData.courseId) {
        setFormData(prev => ({ ...prev, courseId: res.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  };

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

  const handleGenerate = async () => {
    if (!topicPrompt) return;
    setIsGenerating(true);
    try {
      const response = await axios.post('http://localhost:5000/api/content/generate', {
        topic: topicPrompt,
        contentType: formData.type
      });
      
      setFormData(prev => ({
        ...prev,
        title: `Assignment: ${topicPrompt}`,
        content: response.data.content
      }));
    } catch (err) {
      console.error('Generation error:', err);
      alert('Failed to generate assignment content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSaving(true);
    try {
      const res = await axios.post('http://localhost:5000/api/assignments', formData);
      setSaveSuccess(true);
      await fetchAssignments();
      
      // Auto open share option for newly created assignment
      setSharingAssignment(res.data.item);

      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Error saving assignment:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // WhatsApp Sharing Helper
  const openWhatsAppShare = (assignment) => {
    const item = assignment || formData;
    const courseName = courses.find(c => c._id === item.courseId)?.name || 'General';
    
    const message = `📚 *ASSIGNMENT: ${item.title}*\n` +
      `🎓 Course: ${courseName}\n` +
      `💯 Total Marks: ${item.totalMarks || 50} | 📅 Due Date: ${item.dueDate || 'TBA'}\n` +
      `----------------------------------------\n` +
      `${item.content.slice(0, 500)}${item.content.length > 500 ? '...' : ''}\n\n` +
      `👉 Please complete and submit before the deadline!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // Email Sharing Helper
  const triggerEmailShare = (assignment) => {
    const item = assignment || formData;
    const courseName = courses.find(c => c._id === item.courseId)?.name || 'General Course';
    
    const subject = encodeURIComponent(`[${courseName}] New Assignment: ${item.title}`);
    const body = encodeURIComponent(
      `Dear Students,\n\nHere is your assignment for ${courseName}:\n\n` +
      `ASSIGNMENT TITLE: ${item.title}\n` +
      `TOTAL MARKS: ${item.totalMarks || 50}\n` +
      `DUE DATE: ${item.dueDate || 'TBA'}\n\n` +
      `----------------------------------------\n\n` +
      `${item.content}\n\n` +
      `Best regards,\nProfessorOS`
    );

    const bccList = encodeURIComponent(recipientEmails);
    window.location.href = `mailto:?bcc=${bccList}&subject=${subject}&body=${body}`;
  };

  // Print PDF Trigger
  const triggerPrintPDF = (assignment) => {
    const item = assignment || formData;
    setPrintAssignment(item);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-7xl mx-auto text-white">
      {/* Top Header & Tab Controls */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <PenTool className="text-[#FF5D73]" size={36} />
            Assignment Builder
          </h1>
          <p className="text-[#7C7A7A] text-sm mt-1">Design, AI-generate, print PDFs, and broadcast assignments directly to students</p>
        </div>

        <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-[#222]">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'builder'
                ? 'bg-[#FF5D73] text-white shadow-lg shadow-[#FF5D73]/20'
                : 'text-[#7C7A7A] hover:text-white'
            }`}
          >
            <PenTool size={15} /> Assignment Builder
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-[#FF5D73] text-white shadow-lg shadow-[#FF5D73]/20'
                : 'text-[#7C7A7A] hover:text-white'
            }`}
          >
            <BookOpen size={15} /> Assignments Vault ({assignments.length})
          </button>
        </div>
      </header>

      {/* TAB 1: ASSIGNMENT BUILDER FORM */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* AI Generator Banner */}
            <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col md:flex-row items-end gap-4">
              <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles size={15} className="text-[#FF5D73]" /> Generate Assignment with AI
                </label>
                <input 
                  type="text" 
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  placeholder="e.g. Binary Search Tree implementations, Express Middleware & JWT..."
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !topicPrompt.trim()}
                className="w-full md:w-auto px-6 py-3 bg-[#1e1e1e] hover:bg-[#FF5D73] border border-[#333] text-white font-semibold text-xs rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {isGenerating ? 'Generating...' : '✨ Generate'}
              </button>
            </div>

            {/* Assignment Details Form */}
            <div className="glass-panel p-8 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl space-y-6">
              {saveSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle size={16} /> Assignment saved & ready for distribution!
                </div>
              )}

              {/* Title & Course */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8">
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Assignment Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 4: Building a Concurrent Chat Server"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-sm font-bold text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Course Category</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => handleInputChange('courseId', e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5D73]"
                  >
                    <option value="">General Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type, Difficulty, Marks, Due Date */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5D73]"
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
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5D73]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Total Marks</label>
                  <input
                    type="number"
                    value={formData.totalMarks}
                    onChange={(e) => handleInputChange('totalMarks', Number(e.target.value))}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5D73]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Due Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Next Friday 11:59PM"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-3 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                  />
                </div>
              </div>

              {/* Assignment Content Editor */}
              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Assignment Content & Questions (Markdown) *</label>
                <textarea
                  rows={10}
                  placeholder="Enter problem statements, starter code instructions, submission criteria..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-2xl p-4 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73] resize-none leading-relaxed font-mono"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Tags / Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.relatedTopics.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#FF5D73]/15 text-[#FF5D73] border border-[#FF5D73]/30 rounded-lg text-xs font-medium">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type tag and press Enter..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-2 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSave}
                disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 font-semibold text-sm rounded-2xl transition-all shadow-lg shadow-[#FF5D73]/20 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Save size={18} /> Save & Prepare Distribution
              </button>
            </div>
          </div>

          {/* Right Distribution Sidebar / Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-[#222] pb-3">
                <Share2 className="text-[#FF5D73]" size={20} />
                Student Distribution Center
              </h3>
              <p className="text-xs text-[#7C7A7A] mb-6">
                Share this assignment with your students across multiple channels instantly.
              </p>

              <div className="space-y-3">
                {/* Export PDF Button */}
                <button
                  onClick={() => triggerPrintPDF()}
                  disabled={!formData.title.trim()}
                  className="w-full p-4 rounded-2xl bg-[#141414] hover:bg-[#1e1e1e] border border-[#333] text-white flex items-center justify-between text-xs font-semibold transition-all group disabled:opacity-40"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Printer size={18} />
                    </span>
                    <div className="text-left">
                      <div className="font-bold text-sm">Export Official PDF</div>
                      <div className="text-[10px] text-[#7C7A7A]">Print or save formatted document</div>
                    </div>
                  </div>
                </button>

                {/* Share WhatsApp Button */}
                <button
                  onClick={() => openWhatsAppShare()}
                  disabled={!formData.title.trim()}
                  className="w-full p-4 rounded-2xl bg-[#141414] hover:bg-[#1e1e1e] border border-[#333] text-white flex items-center justify-between text-xs font-semibold transition-all group disabled:opacity-40"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <MessageCircle size={18} />
                    </span>
                    <div className="text-left">
                      <div className="font-bold text-sm">Share via WhatsApp</div>
                      <div className="text-[10px] text-[#7C7A7A]">Broadcast to student groups</div>
                    </div>
                  </div>
                </button>

                {/* Email Broadcast Button */}
                <button
                  onClick={() => setEmailModalOpen(true)}
                  disabled={!formData.title.trim()}
                  className="w-full p-4 rounded-2xl bg-[#141414] hover:bg-[#1e1e1e] border border-[#333] text-white flex items-center justify-between text-xs font-semibold transition-all group disabled:opacity-40"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <Mail size={18} />
                    </span>
                    <div className="text-left">
                      <div className="font-bold text-sm">Email Broadcast</div>
                      <div className="text-[10px] text-[#7C7A7A]">Send to multiple student emails</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED ASSIGNMENTS VAULT */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {assignments.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-[#222] text-[#7C7A7A]">
              <PenTool size={44} className="mx-auto mb-3 opacity-30 text-[#FF5D73]" />
              <h3 className="text-lg font-semibold text-white mb-1">No Saved Assignments</h3>
              <p className="text-xs">Create your first assignment using the Builder tab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col justify-between hover:border-[#FF5D73]/30 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20">
                        {item.type || 'Theory'} • {item.difficulty || 'Medium'}
                      </span>
                      {item.courseId && (
                        <span className="text-[11px] font-medium text-[#7C7A7A] flex items-center gap-1">
                          <Folder size={12} className="text-[#FF5D73]" /> {item.courseId.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF5D73] transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-[#7C7A7A] mb-4">
                      <span className="flex items-center gap-1">
                        <Award size={13} className="text-amber-400" /> {item.totalMarks || 50} Marks
                      </span>
                      {item.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-[#FF5D73]" /> {item.dueDate}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#A0A0A0] line-clamp-3 mb-4 leading-relaxed font-mono bg-[#141414] p-3 rounded-xl border border-[#222]">
                      {item.content}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1e1e1e] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => triggerPrintPDF(item)}
                        className="p-2 rounded-xl bg-[#141414] border border-[#333] text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                        title="Print / PDF"
                      >
                        <Printer size={15} />
                      </button>

                      <button
                        onClick={() => openWhatsAppShare(item)}
                        className="p-2 rounded-xl bg-[#141414] border border-[#333] text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </button>

                      <button
                        onClick={() => {
                          setSharingAssignment(item);
                          setEmailModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-[#141414] border border-[#333] text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                        title="Email Broadcast"
                      >
                        <Mail size={15} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-xl bg-[#141414] border border-[#333] text-[#7C7A7A] hover:text-red-400 transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EMAIL BROADCAST MODAL */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-3xl border border-[#222] bg-[#0a0a0a] max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <Mail className="text-blue-400" size={20} />
                Email Broadcast to Students
              </h3>
              <button onClick={() => setEmailModalOpen(false)} className="text-[#7C7A7A] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-[#7C7A7A] mb-6">
              Enter student email addresses separated by commas. Emails will be added as BCC to maintain student privacy.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase">Student Emails (Comma-separated)</label>
                <textarea
                  rows={4}
                  placeholder="student1@gmail.com, student2@university.edu, batch2026@gmail.com..."
                  value={recipientEmails}
                  onChange={(e) => setRecipientEmails(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl p-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2.5 bg-[#1e1e1e] text-[#A0A0A0] hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    triggerEmailShare(sharingAssignment);
                    setEmailModalOpen(false);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Mail size={15} /> Launch Email Client
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* PRINT STYLES & PRINTABLE ASSIGNMENT TEMPLATE */}
      {printAssignment && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-12 z-[9999]">
          <div className="border-b-2 border-black pb-6 mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wider text-black">ProfessorOS Official Assignment</h1>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">{printAssignment.title}</h2>
              <p className="text-sm text-gray-600 mt-1">Course: {courses.find(c => c._id === printAssignment.courseId)?.name || 'General'}</p>
            </div>
            <div className="text-right text-sm font-semibold">
              <p>Total Marks: {printAssignment.totalMarks || 50}</p>
              <p>Due Date: {printAssignment.dueDate || 'TBA'}</p>
              <p>Difficulty: {printAssignment.difficulty}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-bold uppercase tracking-wide border-b border-gray-400 pb-1 mb-3">Instructions & Content</h3>
            <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {printAssignment.content}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-300 flex justify-between text-xs text-gray-500">
            <p>Generated via ProfessorOS Academic Platform</p>
            <p>Student Signature: ______________________</p>
          </div>
        </div>
      )}
    </div>
  );
}
