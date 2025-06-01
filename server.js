import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', './templates');
app.get('/', (request, response) => {
    response.render('index');
});

app.use('/static', express.static('./static'));

app.listen(5080);