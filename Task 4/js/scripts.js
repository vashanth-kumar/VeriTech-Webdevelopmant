document.addEventListener('DOMContentLoaded', () => {
    const trendingMovies = [
        { title: 'Movie 1', image: 'assets/images/movie1.jpg' },
        { title: 'Movie 2', image: 'assets/images/movie2.jpg' },
        { title: 'Movie 3', image: 'assets/images/movie3.jpg' },
        // Add more movies as needed
    ];

    const recommendedMovies = [
        { title: 'Movie 4', image: 'assets/images/movie4.jpg' },
        { title: 'Movie 5', image: 'assets/images/movie5.jpg' },
        { title: 'Movie 6', image: 'assets/images/movie6.jpg' },
        // Add more movies as needed
    ];

    function displayMovies(movies, containerId) {
        const container = document.getElementById(containerId);
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');

            const movieImage = document.createElement('img');
            movieImage.src = movie.image;
            movieImage.alt = movie.title;

            movieItem.appendChild(movieImage);
            container.appendChild(movieItem);
        });
    }

    displayMovies(trendingMovies, 'trending-now');
    displayMovies(recommendedMovies, 'recommended');
});
