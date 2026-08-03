import PersonalChannel from '../models/PersonalChannel.model.js';
import Parser from 'rss-parser';

const parser = new Parser();

const DEFAULT_CHANNELS = [
  { name: 'Fireship', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA', category: 'Tech & Code' },
  { name: 'Traversy Media', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UC29ju8bIPH5as8OGnQzwJyA', category: 'Web Dev' },
  { name: 'Web Dev Simplified', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCFbNIlppjAuEX4znoulh0Cw', category: 'Web Dev' }
];

export const getChannels = async (req, res) => {
  try {
    let channels = await PersonalChannel.find().sort({ createdAt: -1 });
    
    // Seed default channels if empty
    if (channels.length === 0) {
      await PersonalChannel.insertMany(DEFAULT_CHANNELS);
      channels = await PersonalChannel.find().sort({ createdAt: -1 });
    }

    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addChannel = async (req, res) => {
  try {
    const { name, inputUrl, category } = req.body;
    if (!name || !inputUrl) {
      return res.status(400).json({ error: 'Channel name and YouTube URL or Channel ID are required' });
    }

    let rssUrl = inputUrl.trim();

    // If user provided a raw YouTube Channel ID (starts with UC...)
    if (/^UC[\w-]{22}$/.test(rssUrl)) {
      rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${rssUrl}`;
    } else if (!rssUrl.includes('youtube.com/feeds/videos.xml')) {
      // Try to extract channel ID if full link provided or construct user feed
      const channelIdMatch = rssUrl.match(/channel\/(UC[\w-]{22})/);
      if (channelIdMatch) {
        rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdMatch[1]}`;
      } else {
        // Fallback: search or handle
        const handleMatch = rssUrl.match(/@([\w-]+)/);
        if (handleMatch) {
          rssUrl = `https://www.youtube.com/feeds/videos.xml?user=${handleMatch[1]}`;
        }
      }
    }

    const channel = new PersonalChannel({
      name: name.trim(),
      rssUrl,
      category: category || 'Personal Growth'
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    await PersonalChannel.findByIdAndDelete(id);
    res.json({ message: 'Channel removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGrowthFeed = async (req, res) => {
  try {
    let channels = await PersonalChannel.find();
    if (channels.length === 0) {
      await PersonalChannel.insertMany(DEFAULT_CHANNELS);
      channels = await PersonalChannel.find();
    }

    const allVideos = [];

    // Parse RSS feeds in parallel
    await Promise.all(
      channels.map(async (ch) => {
        try {
          const parsed = await parser.parseURL(ch.rssUrl);
          if (parsed && parsed.items) {
            parsed.items.slice(0, 5).forEach((item) => {
              // Extract YouTube video ID for thumbnail
              let videoId = '';
              const link = item.link || '';
              const match = link.match(/v=([\w-]+)/);
              if (match) {
                videoId = match[1];
              }

              const thumbnailUrl = videoId
                ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                : '';

              allVideos.push({
                id: item.id || link,
                title: item.title,
                link,
                channelName: ch.name,
                category: ch.category,
                publishedAt: item.isoDate || item.pubDate,
                thumbnailUrl,
                videoId
              });
            });
          }
        } catch (feedErr) {
          console.warn(`[Growth Feed] Error parsing feed for ${ch.name}:`, feedErr.message);
        }
      })
    );

    // Sort videos by date descending
    allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.json({
      channels,
      videos: allVideos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
