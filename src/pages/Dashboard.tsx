import { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItem {
  title: string;
  source: string;
  summary: string;
  link: string;
  category: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const tabs = [
    { id: 'all', label: 'All News' },
    { id: 'ai', label: 'Artificial Intelligence' },
    { id: 'finance', label: 'Finance & Markets' },
    { id: 'trending', label: 'World Trending' }
  ];

  useEffect(() => {
    fetchNews(activeTab);
  }, [activeTab]);

  const fetchNews = async (category: string) => {
    setLoading(true);
    setError(false);
    try {
      // Automatically switch between local testing and production hosting
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_BASE_URL}/api/news?category=${category}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setNews(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="text-gradient">News Dashboard</h2>
        <Link to="/" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Home size={20} /> Home
        </Link>
      </header>

      <div className="filters">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`filter-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loader">
          <div className="loader-spinner"></div>
        </div>
      ) : error ? (
        <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          Failed to load news. Ensure the backend server is running on port 5000.
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item, idx) => (
            <NewsCard 
              key={idx}
              title={item.title}
              source={item.source}
              summary={item.summary}
              link={item.link}
            />
          ))}
        </div>
      )}
    </div>
  );
}
