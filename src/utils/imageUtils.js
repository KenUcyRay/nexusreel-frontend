const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Jika sudah berupa full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Jika imagePath berupa "movies/filename.jpg"
  return `${API_BASE_URL}/storage/${imagePath}`;
};

export const getPlaceholderImage = () => '/placeholder-movie.jpg';