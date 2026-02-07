# User Service

The User Service handles user authentication and profile management for the Task Microservices ecosystem.

## Features

- **User Authentication**: Secure signup and signin using `bcrypt` for password hashing and `jsonwebtoken` (JWT) for session management.
- **Event Publishing**: Automatically notifies the Notification Service when a new user signs up.
- **Security**: 
    - Rate limiting to prevent brute-force attacks.
    - JWT tokens stored in HTTP-only cookies.
- **Standardized Infrastructure**:
    - Global Error Handling.
    - Centralized logging with `Winston`.
    - Health-check ready (includes `curl`).

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Create a new user account | No |
| POST | `/signin` | Authenticate user and receive cookie | No |
| GET | `/view` | View current user profile | Yes |
| GET | `/logout` | Clear authentication cookie | No |
| GET | `/` | Health check endpoint | No |

## Environment Variables

Required `.env` variables:
- `PORT`: Service port (default: 3000)
- `MONGO_URI`: MongoDB connection string
- `JSONWEBTOKEN_KEY`: Secret key for JWT signing

## Tech Stack

- Node.js & Express
- MongoDB
- Winston (Logging)
- Docker (Alpine base)
