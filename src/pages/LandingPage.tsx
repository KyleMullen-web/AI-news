import { Link } from 'react-router-dom';
import { Sparkles, BarChart3, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container">
      <div className="hero">
        <h1 className="text-gradient">Pulse News AI</h1>
        <p>
          Cut through the noise. We aggregate the latest updates across AI, Finance, and World Trending news, 
          then use advanced open-source AI models to summarize what actually matters.
        </p>
        <Link to="/dashboard" className="btn-primary">
          Open Dashboard
        </Link>
        
        <div style={{ display: 'flex', gap: '2rem', marginTop: '4rem' }}>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', width: '250px' }}>
            <Sparkles className="text-gradient" size={32} style={{ marginBottom: '1rem' }} />
            <h3>AI Summaries</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Get straight to the point with bullet-point summaries powered by Llama 3.</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', width: '250px' }}>
            <BarChart3 className="text-gradient" size={32} style={{ marginBottom: '1rem' }} />
            <h3>Finance & Tech</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Track market movements and tech breakthroughs in real-time.</p>
          </div>
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', width: '250px' }}>
            <Globe className="text-gradient" size={32} style={{ marginBottom: '1rem' }} />
            <h3>World Trends</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Stay informed on global events with top trending stories.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
