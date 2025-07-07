## API Endpoints

### GET /movies/:id/reviews

Fetch paginated reviews for a specific movie.

**Query parameters:**

- `page` (optional): page number (default: 1)

**Response:**

```json
{
    "data": [ /* array of reviews */ ]
}