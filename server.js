import express from 'express';
import cors from 'cors';
import Parser from 'rss-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const parser = new Parser();
const PORT = process.env.PORT || 5000;

// Free openrouter API (make sure your .env has OPENROUTER_API_KEY)
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ? process.env.OPENROUTER_API_KEY.replace(/\s+/g, '') : null;

// News Sources organized by Category
const CATEGORY_FEEDS = {
  ai: [
    { name: "OpenAI", url: "https://openai.com/news/rss.xml" },
    { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" }
  ],
  finance: [
    { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" }
  ],
  trending: [
    { name: "BBC Top News", url: "http://feeds.bbci.co.uk/news/rss.xml" }
  ]
};

// Simple in-memory cache to prevent burning through API limits
const cache = new Map();

async function getAiSummary(text) {
  if (!OPENROUTER_API_KEY) return "AI Summary unavailable (No API Key).";
  if (!text || text.trim() === "") return "No content available.";
  
  // Clean text a bit
  const cleanText = text.replace(/<[^>]*>?/gm, '').substring(0, 500);
  
  if (cache.has(cleanText)) {
    return cache.get(cleanText);
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Pulse AI News Dashboard"
      },
      body: JSON.stringify({
        "model": "openrouter/free",
        messages: [{ role: "user", content: `Summarize this news update in 2 short, concise bullet points highlighting the main impact:\n\n${cleanText}` }]
      })
    });
    
    const data = await response.json();
    if (data.error) {
      console.error("OpenRouter API Error:", data.error.message);
      return `Summary unavailable (${data.error.message})`;
    }
    const summary = data.choices[0].message.content;
    cache.set(cleanText, summary);
    return summary;
  } catch (error) {
    console.error("Error fetching AI summary:", error);
    return "Summary currently unavailable.";
  }
}

app.get('/api/news', async (req, res) => {
  const categoryParam = req.query.category || 'all';
  let allNews = [];

  const targetCategories = categoryParam === 'all' 
    ? Object.keys(CATEGORY_FEEDS) 
    : [categoryParam.toLowerCase()];

  try {
    for (const category of targetCategories) {
      if (!CATEGORY_FEEDS[category]) continue;
      
      for (const source of CATEGORY_FEEDS[category]) {
        try {
          const feed = await parser.parseURL(source.url);
          // Grab top 2 articles per source to keep it fast
          const entries = feed.items.slice(0, 2);
          
          for (const entry of entries) {
            const contentToSummarize = entry.contentSnippet || entry.content || entry.title;
            const summary = await getAiSummary(contentToSummarize);
            
            // Add a 1 second delay to avoid hitting OpenRouter rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            allNews.push({
              title: entry.title,
              link: entry.link,
              source: source.name,
              category: category,
              summary: summary,
              pubDate: entry.pubDate
            });
          }
        } catch (e) {
          console.error(`Failed to fetch feed ${source.url}`, e);
        }
      }
    }
    res.json(allNews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
