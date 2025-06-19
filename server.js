import express, { request, response } from 'express';
import { marked } from 'marked';
import { fetchReviews, postReview } from './cms';

const app = express();
app.use(express.json());

app.set('view engine', 'pug');
app.set('views', './templates');

app.get('/', (request, response) => {
    response.render('home');
});

app.get('/movies', async (request, response) => {
    try {
        const res = await fetch('https://plankton-app-xhkom.ondigitalocean.app/api/movies');
        const movies = await res.json();
        response.render('movies', { movies });
    } catch (err) {
        console.error(err);
        response.status(500).send('Error fetching movie list');
    }
});

app.get('/movies/:id', async (request, response) => {
    const { id } = request.params; // Same as ' const id = request.params.id; '
    try {
        const res = await fetch(`https://plankton-app-xhkom.ondigitalocean.app/api/movies/${id}`);
        if (!res.ok) {
            throw new Error('Movie not found');
        }

        const movie = await res.json();
        response.render('movie', { 
            title:movie.data.attributes.title, 
            image: movie.data.attributes.image.url, 
            intro: marked(movie.data.attributes.intro) //for markdown!
        });

    } catch (err) {
        console.error(err);
        response.status(404).render('error', { message: 'Movie not found', statusCode: 404 });
    }
});

app.get('/movies/:id/reviews', async (request, response) => {
    const 
        movieId = request.params.id, 
        page = Number(request.query.page) || 1;

    try {
        const reviews = await fetchReviews(movieId, page, 5);
        response.json(reviews);
    } catch (err) {
        console.log(err);
        response.status(502).json({error: 'Failed to fetch reviews from CMS'});
    }
});

app.post('/movies/:id/reviews', async (request, response) => {
    const 
        movieId = request.params.id,
        { name, rating, comment = ''} = request.body; //destructuring request.body dvs plockar ur specifika variabler
    
    //Validation of review
    if(
        !name || typeof name !== 'string' || name.trim() === '' || 
        typeof rating !== 'number' || rating < 0 || rating > 5
    ) {
        return response.status(400).json({
            error: 'Invalid input: name and rating (0-5) is required!'
        });
    }

    //Posting review to CMS
    try {
        const result = await postReview(
            movieId, 
            name.trim(), 
            rating, 
            comment.trim());
        response.status(201).json(result);
    } catch (err) {
        console.error(err);
        response.status(502).json({error: 'Failed to post review to CMS'});
    }

});

app.use('/static', express.static('./static'));

if (process.env.NODE_ENV !== 'test') {  //Code only runs if it's not used for testing
    app.listen(5080);
}

export { app };