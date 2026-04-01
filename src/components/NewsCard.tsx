// Standard a tag used for external URL
import { Newspaper } from 'lucide-react';

interface NewsCardProps {
  title: string;
  source: string;
  summary: string;
  link: string;
}

export default function NewsCard({ title, source, summary, link }: NewsCardProps) {
  return (
    <div className="news-card glass">
      <div className="card-source">
        <Newspaper size={16} />
        {source}
      </div>
      <a href={link} target="_blank" rel="noopener noreferrer" className="card-title">
        {title}
      </a>
      <div className="card-summary">
        {/* Render summary cleanly, sometimes APIs return markdown bullets */}
        {summary.split('\n').map((line, i) => (
          <p key={i} style={{ marginBottom: '0.5rem' }}>{line}</p>
        ))}
      </div>
    </div>
  );
}
