import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, FolderPlus, CheckCircle, ExternalLink, BookOpen, Trash2, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function LessonBuilder() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [recentLessons, setRecentLessons] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchRecentLessons();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
      if (res.data.length > 0 && !selectedCourse) {
        setSelectedCourse(res.data[0].name);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchRecentLessons = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lessons');
      setRecentLessons(res.data);
    } catch (err) {
      console.error('Error fetching lessons:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(ext)) {
      setErrorMessage('Only PDF, DOC, DOCX, or TXT files are allowed.');
      return;
    }
    setErrorMessage('');
    setSelectedFile(file);
    if (!lessonTitle) {
      // Auto-set title from file name without extension
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setLessonTitle(nameWithoutExt);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    const courseToUse = isCreatingCourse ? newCourseName : selectedCourse;
    if (!courseToUse || !courseToUse.trim()) {
      setErrorMessage('Please specify a course name.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', lessonTitle);
    if (isCreatingCourse) {
      formData.append('newCourseName', newCourseName.trim());
    } else {
      formData.append('courseName', selectedCourse);
    }
    formData.append('notes', notes);

    try {
      const res = await axios.post('http://localhost:5000/api/lessons/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setUploadSuccess(true);
      setSelectedFile(null);
      setLessonTitle('');
      setNotes('');
      setNewCourseName('');
      setIsCreatingCourse(false);

      // Refresh list and notify sidebar
      await fetchCourses();
      await fetchRecentLessons();
      
      // Dispatch custom event so Sidebar updates instantly
      window.dispatchEvent(new Event('courseAdded'));

      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) {
      console.error('Upload failed:', err);
      setErrorMessage(err.response?.data?.error || 'Failed to upload lesson document.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 tracking-tight flex items-center gap-3">
          <BookOpen className="text-[#FF5D73]" size={36} />
          Lesson Builder
        </h1>
        <p className="text-[#7C7A7A]">Upload course materials (PDF, DOC) for lifetime access and seamless learning</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Form Section */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 rounded-2xl border border-[#222] bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-[#222] pb-4">
              <FolderPlus className="text-[#FF5D73]" size={22} />
              Add New Lesson Material
            </h2>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {uploadSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2"
              >
                <CheckCircle size={18} />
                Lesson document uploaded & categorized successfully!
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Course Category <span className="text-[#FF5D73]">*</span>
                </label>
                
                {!isCreatingCourse ? (
                  <div className="flex gap-3">
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="flex-1 bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF5D73] transition-colors"
                    >
                      {courses.map((course) => (
                        <option key={course._id} value={course.name}>
                          {course.name}
                        </option>
                      ))}
                      {courses.length === 0 && <option value="">No courses yet (Create one)</option>}
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => setIsCreatingCourse(true)}
                      className="px-4 py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333] text-[#FF5D73] rounded-xl flex items-center gap-2 font-medium transition-colors text-sm"
                    >
                      <Plus size={16} /> New Course
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="e.g., Data Structures & Algorithms, Quantum Physics"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      className="flex-1 bg-[#141414] border border-[#FF5D73] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCreatingCourse(false)}
                      className="px-4 py-3 bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#333] text-[#7C7A7A] rounded-xl text-sm transition-colors"
                    >
                      Select Existing
                    </button>
                  </div>
                )}
              </div>

              {/* Lesson Title */}
              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Lesson Title <span className="text-[#FF5D73]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chapter 1 - Introduction to Binary Trees"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73] transition-colors"
                />
              </div>

              {/* File Upload Drop Area */}
              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Upload Document (PDF / DOC / DOCX) <span className="text-[#FF5D73]">*</span>
                </label>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-[#FF5D73] bg-[#FF5D73]/10 scale-[1.01]'
                      : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-[#333] hover:border-[#555] bg-[#141414]/50'
                  }`}
                  onClick={() => document.getElementById('file-upload-input').click()}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText size={42} className="text-emerald-400" />
                      <span className="font-semibold text-emerald-300 text-lg">{selectedFile.name}</span>
                      <span className="text-xs text-[#7C7A7A]">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change file
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <UploadCloud size={48} className="text-[#FF5D73]" />
                      <div>
                        <p className="font-medium text-white text-base">
                          Drag & drop your lesson PDF or DOC here
                        </p>
                        <p className="text-xs text-[#7C7A7A] mt-1">
                          Supports PDF, DOC, DOCX, TXT up to 50MB
                        </p>
                      </div>
                      <span className="mt-2 inline-block px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-xs font-medium text-[#A0A0A0]">
                        Browse File
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                  Key Notes or Summary (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add quick reference notes or overview for this document..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl p-4 text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-4 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-95 text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#FF5D73]/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <span>Saving Lesson...</span>
                ) : (
                  <>
                    <Sparkles size={20} /> Save Lesson Document
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recently Uploaded Lessons */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 rounded-2xl border border-[#222] bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-[#222] pb-4">
              <FileText className="text-[#FF5D73]" size={22} />
              Saved Lesson Materials ({recentLessons.length})
            </h2>

            {recentLessons.length === 0 ? (
              <div className="text-center py-12 text-[#7C7A7A]">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p>No lesson files uploaded yet.</p>
                <p className="text-xs mt-1">Upload a PDF or DOC to store it for lifetime viewing.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                {recentLessons.map((lesson) => (
                  <motion.div
                    key={lesson._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-[#141414] border border-[#222] hover:border-[#FF5D73]/40 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20">
                          {lesson.courseId?.name || 'General Course'}
                        </span>
                        <h3 className="font-semibold text-white mt-2 group-hover:text-[#FF5D73] transition-colors">
                          {lesson.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#222] text-[#A0A0A0]">
                        {lesson.fileType}
                      </span>
                    </div>

                    <p className="text-xs text-[#7C7A7A] truncate mb-3">
                      Original: {lesson.originalName}
                    </p>

                    {lesson.notes && (
                      <p className="text-xs text-[#B0B0B0] bg-[#0a0a0a] p-2.5 rounded-lg mb-3 italic border border-[#222]">
                        "{lesson.notes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#222]">
                      <span className="text-[11px] text-[#555]">
                        {new Date(lesson.createdAt).toLocaleDateString()}
                      </span>
                      <a
                        href={`http://localhost:5000${lesson.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#FF5D73] font-medium hover:underline"
                      >
                        View / Download <ExternalLink size={13} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
