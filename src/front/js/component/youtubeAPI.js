import React, { useState } from 'react';

export const YouTubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'AIzaSyACjYauYKurLeCZOe6HBknu-tUukQJS1YQ';
  const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${YOUTUBE_API_URL}?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&maxResults=5&key=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Error searching Videos');
      }

      const data = await response.json();
      setVideos(data.items || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Búsqueda de Videos en YouTube</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar videos..."
          style={{
            padding: '10px',
            width: '300px',
            fontSize: '16px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <p>Cargando videos...</p>
      ) : videos.length > 0 ? (
        <div>
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              style={{
                display: 'flex',
                marginBottom: '20px',
                alignItems: 'center',
              }}
            >
              <img
                src={video.snippet.thumbnails.default.url}
                alt={video.snippet.title}
                style={{ marginRight: '20px', width: '120px', height: '90px' }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{video.snippet.title}</h3>
                <p style={{ margin: 0 }}>{video.snippet.description}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron videos.</p>
      )}
    </div>
  );
};