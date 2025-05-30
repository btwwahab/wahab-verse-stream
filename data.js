// === Movie API Integration ===
const baseUrl = "https://api.themoviedb.org/3";
const imageUrlW500 = "https://image.tmdb.org/t/p/w500";
const imageUrl = "https://image.tmdb.org/t/p/original";

let moviesData = {
    trending: [],
    movies: [],
    series: []
};

async function fetchTrending() {
    try {
        // Use our API proxy instead of direct TMDb call
        const response = await fetch(`/api/tmdb?endpoint=/trending/all/day`);
        const data = await response.json();
        return formatTMDbData(data.results);
    } catch (error) {
        console.error('Error fetching trending content:', error);
        return [];
    }
}

async function fetchMovies() {
    try {
        const response = await fetch(`/api/tmdb?endpoint=/movie/popular`);
        const data = await response.json();
        return formatTMDbData(data.results, 'movie');
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

async function fetchSeries() {
    try {
        const response = await fetch(`/api/tmdb?endpoint=/tv/popular`);
        const data = await response.json();
        return formatTMDbData(data.results, 'tv');
    } catch (error) {
        console.error('Error fetching series:', error);
        return [];
    }
}

async function fetchVideos(id, mediaType) {
    try {
        const response = await fetch(`/api/tmdb?endpoint=/${mediaType}/${id}/videos`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
}

async function fetchGenres() {
    try {
        const [movieResponse, tvResponse] = await Promise.all([
            fetch(`/api/tmdb?endpoint=/genre/movie/list`),
            fetch(`/api/tmdb?endpoint=/genre/tv/list`)
        ]);

        if (!movieResponse.ok || !tvResponse.ok) {
            throw new Error('Failed to fetch genres');
        }

        const movieData = await movieResponse.json();
        const tvData = await tvResponse.json();

        const allGenres = [...(movieData.genres || []), ...(tvData.genres || [])];
        const uniqueGenres = [];
        const seenIds = new Set();

        allGenres.forEach(genre => {
            if (genre && genre.id && !seenIds.has(genre.id)) {
                seenIds.add(genre.id);
                uniqueGenres.push(genre);
            }
        });

        return uniqueGenres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
}

async function fetchContentByGenre(genreId, page = 1) {
    try {
        const [movieResponse, tvResponse] = await Promise.all([
            fetch(`/api/tmdb?endpoint=/discover/movie&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`),
            fetch(`/api/tmdb?endpoint=/discover/tv&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`)
        ]);

        if (!movieResponse.ok || !tvResponse.ok) {
            throw new Error(`Failed to fetch content for genre ${genreId}`);
        }

        const movieData = await movieResponse.json();
        const tvData = await tvResponse.json();

        const movies = formatTMDbData(movieData.results || [], 'movie');
        const tvShows = formatTMDbData(tvData.results || [], 'tv');

        return [...movies, ...tvShows];
    } catch (error) {
        console.error(`Error fetching content for genre ${genreId}, page ${page}:`, error);
        return [];
    }
}

// Rest of the code remains the same
function formatTMDbData(items, forcedType = null) {
    if (!items || !Array.isArray(items)) return [];

    return items.map(item => {
        if (!item) return null;

        const mediaType = forcedType || item.media_type || 'movie';
        return {
            id: item.id,
            title: item.title || item.name || 'Unknown Title',
            poster: item.poster_path ? `${imageUrlW500}${item.poster_path}` : null,
            backdrop: item.backdrop_path ? `${imageUrl}${item.backdrop_path}` : null,
            overview: item.overview || 'No description available',
            rating: item.vote_average ? item.vote_average / 2 : 0,
            year: getYear(item.release_date || item.first_air_date),
            genre: getGenreFromId(item.genre_ids ? item.genre_ids[0] : null),
            genre_ids: item.genre_ids || [],
            category: mediaType === 'movie' ? 'action' : 'drama',
            mediaType: mediaType
        };
    }).filter(item => item !== null);
}

function getYear(dateString) {
    if (!dateString) return 'Unknown';
    return new Date(dateString).getFullYear();
}

function getGenreFromId(genreId) {
    const genres = {
        28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
        80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
        14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
        9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
        10752: 'War', 37: 'Western'
    };
    return genres[genreId] || 'Unknown';
}

function loadContentLibrary() {
    return Promise.all([
        fetchTrending(),
        fetchMovies(),
        fetchSeries()
    ]).then(([trending, movies, series]) => {
        moviesData = { trending, movies, series };
        return moviesData;
    }).catch(error => {
        console.error('Error loading content:', error);
        showNotification('Neural connection error. Try again later.', 'danger');
        throw error;
    });
}