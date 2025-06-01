import express from 'express';

const app = express();

app.get('/', (request, response) => {
    response.send('Server is running!');
});

app.listen(5080);