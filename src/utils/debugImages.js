// Debug script untuk memeriksa gambar movie
import { getImageUrl, getPlaceholderImage } from './imageUtils';

export const debugMovieImages = (movies) => {
  console.group('🖼️ Movie Images Debug');
  
  movies.forEach((movie, index) => {
    console.group(`Movie ${index + 1}: ${movie.name}`);
    console.log('Raw movie data:', movie);
    console.log('Image field:', movie.image);
    console.log('Image URL field:', movie.image_url);
    
    const finalUrl = movie.image_url || getImageUrl(movie.image) || getPlaceholderImage();
    console.log('Final image URL:', finalUrl);
    
    // Test if image exists
    if (finalUrl && finalUrl !== getPlaceholderImage()) {
      const img = new Image();
      img.onload = () => console.log('✅ Image loads successfully');
      img.onerror = () => console.log('❌ Image failed to load');
      img.src = finalUrl;
    }
    
    console.groupEnd();
  });
  
  console.groupEnd();
};

export const testImageUrl = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};