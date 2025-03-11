
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();
        if (query.length < 2) {
            searchResults.innerHTML = "";
            return;
        }

        try {
            const response = await fetch(`/video/search/movies?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            searchResults.innerHTML = "";

            if (data.results.length === 0) {
                searchResults.innerHTML = "<p>❌ לא נמצאו סרטים תואמים.</p>";
                return;
            }

            data.results.forEach(movie => {
                const movieCard = document.createElement("div");
                movieCard.classList.add("movie-card");
                movieCard.innerHTML = `
                    <div class="movie-image">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    </div>
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p>⭐ דירוג: ${movie.vote_average.toFixed(1)}</p>
                        <a href="/video/movie/${movie.id}" class="btn">📽️ פרטים נוספים</a>
                    </div>
                `;
                searchResults.appendChild(movieCard);
            });

        } catch (error) {
            console.error("❌ שגיאה בחיפוש סרטים:", error);
        }
    });
});
