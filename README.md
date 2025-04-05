# DebateAI

**DebateAI** is a platform where users can engage in live debates—either with real people or AI agents—through text or video. Create or join debate rooms, choose your side, and sharpen your critical thinking in a fun and competitive environment.


## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
   - [Clone the Repository](#clone-the-repository)
   - [Frontend Setup](#frontend-setup)
   - [Backend Setup](#backend-setup)
5. [Environment Variables](#environment-variables)
   - [How to Get These Variables](#how-to-get-these-variables)
6. [Contributing](#contributing)
7. [License](#license)

## Project Overview

DebateAI is designed to make debating more accessible and engaging by allowing users to face off against real opponents or AI agents. The platform supports both text-based and video debates, real-time interactions, and performance tracking making it ideal for learners, enthusiasts, or anyone looking to enhance their argumentation skills.


## Features

- Real-time debate rooms (text and video)
- Play against AI agents or real users
- Track performance and match history
- Topic-based room selection
- Public or private room creation
- AI judging

## Prerequisites
- Go 1.21+
- Vite + React
- Open Router API key
- Supabase


## Installation

### Clone the Repository

```bash
git clone https://github.com/Naman-B-Parlecha/sample-debate-ai.git
```

```bash
cd sample-debate-ai
```

### Frontend Setup

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

### Backend Setup

```bash
cd backend
```

```bash
go mod download
```

```bash
go run cmd/server/main.go
```


## Environment Variables

Create a `.env` file in the `backend/` directory and add the following:

```env
SUPABASE_URL=
SUPABASE_KEY=
JWT_SECRET=
SERVER_PORT=8080

HF_API_KEY=
OPEN_ROUTER_API=
```

---

### How to Get These Variables

#### Supabase

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Head to the **Project Settings** → **DATA API** tab.
3. Copy the following values:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `JWT_SECRET` (found under "JWT Settings")

#### Hugging Face

1. Go to [Hugging Face](https://huggingface.co/settings/tokens).
2. Generate a new access token.
3. Use that as your `HF_API_KEY`.

#### OpenRouter

1. Visit [OpenRouter](https://openrouter.ai/).
2. Sign in and generate a new API key.
3. Use that as your `OPEN_ROUTER_API`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feat/tour-feature)
3. Commit your changes (git commit -m 'fix: Your patch name')
4. Push to the branch (git push origin feat/your-feature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Naman-B-Parlecha/sample-debate-ai/blob/main/LICENSE) file for details.
