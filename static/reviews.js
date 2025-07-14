document.addEventListener('DOMContentLoaded', () => {
    const 
        movieId = window.location.pathname.split('/').pop(),
        reviewsList = document.getElementById('reviews-list'),
        loadingIndicator = document.getElementById('reviews-loading'),
        prevBtn = document.getElementById('prev-review'),
        nextBtn = document.getElementById('next-review'),
        reviewForm = document.getElementById('review-form'),
        formMessage = document.getElementById('form-message');

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
                reviewsList.innerHTML = '<li>No reviews yet.</li>';
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

    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';

        const
            name = reviewForm.name.value.trim(),
            rating = parseFloat(reviewForm.rating.value),
            comment = reviewForm.comment.value.trim();

            reviewForm.querySelector('button[type="submit"]').disabled = true;
            formMessage.style.color = 'black';
            formMessage.textContent = 'Submitting your review...';

            try {
                const response = await fetch(`/movies/${movieId}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, rating, comment }),
                });

                const data = await response.json();

                if (response.ok) {
                    formMessage.style.color = 'green';
                    formMessage.textContent = 'Review submitted successfully!';
                    reviewForm.reset();
                    fetchReviews(1);
                } else {
                    formMessage.style.color = 'red';
                    formMessage.textContent = data.error || 'Failed to submit review.';
                } 
            } catch (err) {
                    formMessage.style.color = 'red';
                    formMessage.textContent = `Network error: ${err.message}`;
            } finally {
                reviewForm.querySelector('button[type="submit"]').disabled = false;
            }
    });
});