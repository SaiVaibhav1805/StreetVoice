# StreetVoice REST API Reference

All requests must be prefixed with `/api`. Authenticated routes require an `Authorization: Bearer <TOKEN>` header.

## 1. Authentication Endpoints

### Login Account
* **URL**: `/auth/login`
* **Method**: `POST`
* **Body**:
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```
* **Success Response (200)**:
```json
{
  "token": "eyJhbG...",
  "user": {
    "name": "Jane Doe",
    "role": "citizen"
  }
}
```

### Register Account
* **URL**: `/auth/register`
* **Method**: `POST`
* **Body**:
```json
{
  "name": "Jane Doe",
  "email": "user@example.com",
  "password": "mypassword",
  "role": "citizen"
}
```

---

## 2. Issues Endpoints

### List Issues
* **URL**: `/issues`
* **Method**: `GET`
* **Query Parameters**:
  * `category` (optional)
  * `status` (optional)
  * `search` (optional)

### Create Issue
* **URL**: `/issues`
* **Method**: `POST`
* **Body**:
```json
{
  "title": "Broken sewer cover",
  "description": "Hazardous open drain...",
  "category": "Water Leakage & Sewage",
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  },
  "images": ["http://res.cloudinary.com/..."]
}
```

### Upvote Issue
* **URL**: `/issues/:id/upvote`
* **Method**: `POST`
