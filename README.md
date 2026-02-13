## Meeting Action Items Tracker ##

**A web application that extracts actionable tasks from meeting transcripts using an LLM. Users can edit, manage, and track action items efficiently.**

git clone <your-repo-url>
cd <project-folder>

**Backend Setup**
```bash
cd backend
npm install
```

Create a .env file using .env.example as reference and configure:
```ini
PORT=5000
GEMINI_API_KEY=your_api_key_here
MONGODB_URI="mongodb://127.0.0.1:27017/mini-workspace"
```
Run:
```bash
npm run dev
```

Backend runs at 
```arduino
http://localhost:5000
```

**Frontend Setup**
```bash
cd frontend
npm install
```
create .env and configure:
```ini
VITE_BACKEND_URL="http://localhost:5000/api"
```
Run:
```bash
npm run dev
```


**What is Done**

Paste meeting transcript

LLM-based structured action item extraction

Edit action items

Delete action items

Toggle task status (done / not done)

Zod-based request validation

Centralized error handling middleware

Last 5 transcript history tracking

Health check endpoints for:

Backend server

LLM connection

Rate limiting for LLM requests

Database connection

Clean modular architecture (controllers, services, middleware, schemas)

**What is Not Done**

Authentication / user accounts

Role-based access

Persistent transcript search

Pagination for large histories

Unit tests

Production deployment configuration
