const CMS_BASE = 'https://plankton-app-xhkom.ondigitalocean.com.app/api';

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