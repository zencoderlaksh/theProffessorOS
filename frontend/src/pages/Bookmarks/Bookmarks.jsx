import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, CheckCircle, Circle, Clock } from 'lucide-react';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState({ news: [], videos: [] });

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/discovery/bookmarks');
      setBookmarks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, type, isRead) => {
    try {
      await axios.put('http://localhost:5000/api/discovery/status', { id, type, isRead });
      fetchBookmarks();
    } catch (error) {
      console.error(error);
    }
  };

  const StatusIcon = ({ status }) => {
    if (status === 'Completed') return <CheckCircle size={16} className="text-green-500" />;
    if (status === 'Reading') return <Clock size={16} className="text-yellow-500" />;
    return <Circle size={16} className="text-gray-500" />;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Bookmark className="text-yellow-400" /> Read Later / Bookmarks
      </h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Saved Videos</h2>
          {bookmarks.videos.map(v => (
            <div key={v._id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-2">
              <div>
                <a href={v.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-red-400 block">{v.title}</a>
                <span className="text-xs text-gray-400">{v.channel}</span>
              </div>
              <div className="flex gap-2">
                <select 
                  value={v.isRead} 
                  onChange={(e) => updateStatus(v._id, 'video', e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm outline-none"
                >
                  <option value="Unread">Unread</option>
                  <option value="Reading">Watching</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="p-2"><StatusIcon status={v.isRead} /></div>
              </div>
            </div>
          ))}
          {bookmarks.videos.length === 0 && <p className="text-gray-500">No saved videos.</p>}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Saved Articles & News</h2>
          {bookmarks.news.map(n => (
            <div key={n._id} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-2">
              <div>
                <a href={n.url} target="_blank" rel="noreferrer" className="font-semibold hover:text-blue-400 block">{n.title}</a>
                <span className="text-xs text-gray-400">{n.source}</span>
              </div>
              <div className="flex gap-2">
                <select 
                  value={n.isRead} 
                  onChange={(e) => updateStatus(n._id, 'news', e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm outline-none"
                >
                  <option value="Unread">Unread</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="p-2"><StatusIcon status={n.isRead} /></div>
              </div>
            </div>
          ))}
          {bookmarks.news.length === 0 && <p className="text-gray-500">No saved news.</p>}
        </div>
      </div>
    </div>
  );
}
