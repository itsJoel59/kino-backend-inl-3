import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from './server.js';

global.fetch = jest.fn();

describe('Review routes', () => {
    beforeEach(() => {
        fetch.mockReset();
    });

    test('that GET /movies/:id/reviews returns reviews', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [{ id: '1', attributes: { name: 'Test', rating: 5 } }] }),
        });

        const response = await request(app).get('/movies/1/reviews');
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveLength(1);
    });

    test('that POST /movies/:id/reviews validates input', async () => {
        const response = await request(app).post('/movies/1/reviews').send({ name: '', rating: 10 });
        expect(response.statusCode).toBe(400);
    });

    test('that POST /movies/:id/reviews posts review', async () => {
        
    });
});