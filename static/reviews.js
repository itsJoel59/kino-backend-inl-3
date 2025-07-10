document.addEventListener('DOMContentLoaded', () => {
    const 
        movieId = window.location.pathname.split('/').pop(),
        reviewsList = document.getElementById('reviews-list'),
        loadingIndicator = document.getElementById('reviews-loading'),
        prevBtn = document.getElementById('prev-review'),
        nextBtn = document.getElementById('next-review');

    let 
        currentPage = 1,
        totalPages = 1; //might wanna get this from the API

    async function fetchReviews(page = 1) {
        loadingIndicator.style.display = 'block';
        reviewsList.innerHTML = '';
        prevBtn.disabled = true;
        nextBtn.disabled = true;

        try {
            const response = await fetch(`/movies/${movieId}/reviews?page=${page}`);
            if (!response.ok)
                throw new Error('Failed to fetch reviews');

            const data = await response.json();

            totalPages = data.meta?.pagination?.pageCount || 1;

            if (data.data.length === 0) {
                reviewsList.innerHTML = '<li>No reviews found.</li>';
            } else {
                for (const review of data.data) {
                    const li = document.createElement('li');
                    li.textContent = 
                    `${review.attributes.name} (${review.attributes.rating}/5): ${review.attributes.comment || ''}`;
                    reviewsList.appendChild(li);
                }
            }

            currentPage = page;
            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages;
        } catch (err) {
            reviewsList.innerHTML = `<li class="error">Error loading reviews: ${err.message}</li>`;
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1)
            fetchReviews( currentPage - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages)
            fetchReviews(currentPage + 1);
    });

    fetchReviews();
});