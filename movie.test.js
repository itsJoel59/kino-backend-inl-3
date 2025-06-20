import request from 'supertest';
import { app } from './server.js';

describe('Movie Routes', () => {
    test('should display the appropriate movie title', async () => {
        const response = await request(app).get('/movies/1');
        expect(response.statusCode).toBe(200);
        expect(response.text).toMatch(/<h1.*?>.*?<\/h1>/i);
    });

    test('should return a 404 for non-existing movie', async () => {
        const response = await request(app).get('/movies/random-id-that-probably-doesnt-exist');
        expect(response.statusCode).toBe(404);
        expect(response.text).toContain('Movie not found');
    });
});