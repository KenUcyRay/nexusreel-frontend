import React from 'react';
import { getImageUrl, getPlaceholderImage } from '../../utils/imageUtils';

const MovieCard = ({ movie }) => {
  const imageUrl = movie.image_url || getImageUrl(movie.image) || getPlaceholderImage();
  
  const handleImageError = (e) => {
    console.log('Image failed to load:', imageUrl);
    console.log('Movie data:', movie);
    e.target.src = getPlaceholderImage();
  };

  return (
    <div className="movie-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="movie-image">
        <img
          src={imageUrl}
          alt={movie.name}
          className="w-full h-64 object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{movie.name}</h3>
        <div className="genres flex flex-wrap gap-1 mb-3">
          {movie.genres?.map(genre => (
            <span key={genre.id} className="genre-tag px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {genre.name}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm">{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieCard;