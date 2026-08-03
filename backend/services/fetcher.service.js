import Parser from 'rss-parser';
import { News } from '../models/News.model.js';

const parser = new Parser();

// RSS Feeds exclusively for Internet Tech News, AI Breakthroughs & Market Tools (NO YouTube)
const INTERNET_NEWS_FEEDS = [
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat AI', category: 'AI Tools & Breakthroughs' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI', category: 'AI Tools & Breakthroughs' },
  { url: 'https://www.technologyreview.com/feed/', source: 'MIT Tech Review', category: 'AI Tools & Breakthroughs' },
  { url: 'https://dev.to/feed/tag/ai', source: 'Dev.to AI Community', category: 'New Market Tools' },
  { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', source: 'AWS ML Blog', category: 'AI Tools & Breakthroughs' },
  { url: 'https://reactjs.org/feed.xml', source: 'React Official', category: 'Dev Tools & Web' },
  { url: 'https://nodejs.org/en/feed/blog.xml', source: 'Node.js Core', category: 'Dev Tools & Web' }
];

const determineCategory = (text, defaultCategory) => {
  const lower = text.toLowerCase();
  if (lower.includes('tool') || lower.includes('release') || lower.includes('launched') || lower.includes('app')) {
    return 'New Market Tools';
  }
  if (lower.includes('ai') || lower.includes('gpt') || lower.includes('llm') || lower.includes('claude') || lower.includes('openai') || lower.includes('gemini') || lower.includes('model')) {
    return 'AI Tools & Breakthroughs';
  }
  return defaultCategory;
};

export const fetchNews = async () => {
  console.log('[Fetcher] Starting Internet AI & Tech News Fetch...');
  for (const feed of INTERNET_NEWS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of parsed.items.slice(0, 10)) {
        const category = determineCategory(item.title + ' ' + (item.contentSnippet || ''), feed.category);
        
        await News.updateOne(
          { url: item.link },
          {
            $setOnInsert: {
              title: item.title,
              description: (item.contentSnippet || item.summary || '').slice(0, 300),
              source: feed.source,
              category,
              publishedAt: item.isoDate || item.pubDate,
              url: item.link,
            }
          },
          { upsert: true }
        );
      }
    } catch (error) {
      console.error(`[Fetcher] Failed to fetch news from ${feed.url}:`, error.message);
    }
  }
  console.log('[Fetcher] Internet AI & Tech News Fetch Complete.');
};

export const fetchVideos = async () => {
  // Kept empty as AI & Tech Radar is 100% Internet News & Articles (YouTube handled in Personal Growth)
  return;
};
