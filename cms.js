const CMS_BASE = 'https://plankton-app-xhkom.ondigitalocean.app/api';

export async function fetchReviews(movieId, page = 1, pageSize = 5) {
    const url = new URL(`${CMS_BASE}/reviews`);
    
    url.searchParams.append('filters[movie]', movieId);
    url.searchParams.append('pagination[page]', page);
    url.searchParams.append('pagination[pageSize]', pageSize);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`CMS fetchReviews failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function postReview(movieId, name, rating, comment = '') {
    
    const response = await fetch(`${CMS_BASE}/reviews`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            data: {
                movie: movieId,
                name,
                rating,
                comment
            }
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));    //Assigns an empty object to the errData variable if response is empty or json isn't valid

        throw new Error(
            `CMS postReview failed: 
            ${response.status} 
            ${response.statusText} 
            ${JSON.stringify(errData)}`
        );
    }
}