# API Architecture Overview

This document outlines the API architecture for the DebateAI platform, detailing authentication, user management, debate handling, AI integration, and Judging systems. Each endpoint follows a RESTful design with JWT authentication. Real-time communication is enabled via WebSockets for chat and WebRTC signaling. This modular structure approach ensures scalability and efficient interaction between users, debates, and AI-driven components.

## 1. Authentication & User Management

| Method | Endpoint | Description | Request Body Example |
|--------|---------|-------------|----------------------|
| POST   | `/auth/register` | Register a new user. | `{ "email": "user@test.com", "password": "..." }` |
| POST   | `/auth/login` | Log in and retrieve JWT. | `{ "email": "user@test.com", "password": "..." }` |
| POST   | `/auth/reset-password` | Send password reset email. | `{ "email": "user@test.com" }` |
| GET    | `/users/{user_id}` | Fetch user profile. | N/A |
| PATCH  | `/users/{user_id}` | Update user profile. | `{ "username": "new_name", "bio": "..." }` |
| GET    | `/users/leaderboard` | Fetch global leaderboard. | N/A |


## 2. Debate Management

| Method | Endpoint | Description | Request Body Example |
|--------|---------|-------------|----------------------|
| POST   | `/debate/create` | Create a new debate room. | `{ "topic": "Climate Change", "format": "public", "medium": "video" }` |
| POST   | `/debates/{debate_id}/join` | Join an existing debate room. | N/A |
| GET    | `/debates` | List active debates (filterable). | Query params: `?status=ongoing&format=public` |
| PATCH  | `/debates/{debate_id}/status` | Update debate status (e.g., ongoing → finished). | `{ "status": "finished" }` |
| GET    | `/debates/{debate_id}` | Fetch debate metadata. | N/A |


## 3. AI Integration

| Method | Endpoint | Description | Request Body Example |
|--------|---------|-------------|----------------------|
| POST   | `/ai/generate` | Generate AI counterargument. | `{ "user_input": "Climate change is real", "difficulty": "hard" }` |


## 4. Judge Integration

| Method | Endpoint | Description | Request Body Example |
|--------|---------|-------------|----------------------|
| POST   | `/judge` | Submit ML judge arguments (internal use). | `{"arguments : [{"userId": "123456", "argument":"player made argument"}...]"}` |
| POST   | `/judge/rating-update` | Update Elo ratings post-debate (internal). | `{ "user_a_id": "...", "user_b_id": "...", "score_a": 0.7, "score_b": 0.3 }` |

## 5. Real-Time Communication (WebSocket)

| Route | Description | Event Payload Example |
|--------|-------------|----------------------|
| `/ws/signaling` | WebRTC signaling (offer/answer/ICE exchange). | `{ "event": "offer", "room_id": "...", "offer": "..." }` |
| `/ws/chat/{room_id}` | Real-time text chat for debates. | `{ "message": "Hello!", "sender_id": "..." }` |

