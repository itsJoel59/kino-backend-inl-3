# Movie Reviews API


This project lets users view and submit reviews for specific movies.
The reviews and movie data are fetched from an external CMS.

---

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
```

---

### POST /movies/:id/reviews

This allows clients to submit reviews for a movie by ID.

**Body:**

```json
{
    "name": "Reviewer name",
    "rating": 4,
    "comment": "Optional comment"
}
```

**Validation:**

- `name`: non-empty string, required

- `rating`: number between 0 and 5, required

- `comment`: optional string

**Response:**

- `201 Created` on success

- `400 Bad Request` on validation failure

- `502 Bad Gateway` if CMS fails

---

## Running Tests

npm test

Tests are written using jest and supertest. Mocks are used to simulate CMS and API.

---