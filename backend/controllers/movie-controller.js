import { fetchFromTMDB } from '../services/tmdb-services.js';

export async function getTrendingMovie(req, res) {
  try {
    const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=pt-BR');
    const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];

    res.json({ success: true, content: randomMovie });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
