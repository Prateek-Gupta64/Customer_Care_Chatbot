# Customer Care Chatbot

An AI customer support chatbot powered by Google Gemini. Customers open a simple web page and ask questions about orders, delivery, returns and payments. The bot answers **only from your own FAQ file**, so it never makes up policies.


## Features

- Clean chat interface that works on desktop and mobile
- Answers come from `knowledge/faq.md`, so you control what the bot says
- API key stays on the server, so users never see or enter it
- Replies in English, Hindi or Hinglish, matching the customer
- Built-in rate limit (20 messages per minute per user)
- Hands off to human support when it doesn't know the answer

## How it works

```
Browser (frontend/index.html)  ->  Node server (backend/server.js)  ->  Gemini API
                                          ^
                                   knowledge/faq.md + .env (API key)
```

## Project structure

```
Customer_Care_Chatbot/
├── backend/        Express server (holds the API key, calls Gemini)
├── frontend/       Chat page (HTML, CSS and JS in one file)
├── knowledge/      Company FAQ and policies the bot learns from
├── docs/           Documentation and screenshots
└── .gitignore      Keeps .env and node_modules out of GitHub
```

## Installation (Windows, Mac or Linux)

### 1. Install Node.js
Download the **LTS** version from [nodejs.org](https://nodejs.org) and install it. Check it worked:
```
node -v
```
It should show version 18 or higher.

### 2. Get the project
Either download the ZIP (**Code > Download ZIP**) and unzip it, or with Git:
```
git clone https://github.com/Prateek-Gupta64/Customer_Care_Chatbot.git
```

### 3. Get a free Gemini API key
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in and click **Create API key**
3. Copy the key. Never share it or upload it to GitHub.

### 4. Install dependencies
Open a terminal in the `backend` folder and run:
```
npm install
```

### 5. Add your key
In the `backend` folder, create a file named exactly `.env` (copy `.env.example` and rename it) with:
```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```
On Windows, make sure the file isn't saved as `.env.txt`.

### 6. Add your business details
Open `knowledge/faq.md` and replace the sample ACME Store text with your real contact details, policies, delivery times and return rules. The more complete it is, the better the bot answers.

### 7. Start the server
Still in the `backend` folder:
```
npm start
```
You should see `Chatbot backend running on http://localhost:3000`. Keep this window open.

### 8. Chat
Open `frontend/index.html` in your browser and start talking.

Each time you want to use the bot, repeat only step 7 and step 8.

## Updating the bot's answers
Edit `knowledge/faq.md`, save, then restart the server (press `Ctrl + C` and run `npm start` again). The file is read only when the server starts.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Missing script: "start"` | You're not in the `backend` folder, or `package.json` is missing |
| `Cannot find package 'express'` | Run `npm install` in the `backend` folder |
| `Missing GEMINI_API_KEY in .env` | Create the `.env` file inside `backend` with your key |
| "Can't reach the support server" | The server isn't running. Run `npm start`, then check `http://localhost:3000/health` shows `{"ok":true}` |
| "AI service error" | Read the error printed in the terminal. Usually a wrong key or unavailable model, so set `GEMINI_MODEL=gemini-2.5-flash` |

## Deploying online

1. Host the `backend` folder on a service like Render or Railway (start command: `npm start`).
2. Add `GEMINI_API_KEY` in the host's **Environment Variables** settings. Don't put it in the code.
3. In `frontend/index.html`, set `API_URL` to your deployed backend URL.
4. Host `frontend/index.html` on GitHub Pages or Netlify.

## Security notes

- Never commit your `.env` file. The included `.gitignore` blocks it.
- If a key is ever exposed, revoke it in Google AI Studio and create a new one.
- Only put information in `faq.md` that you are happy for customers to see.

## Tech stack

Node.js, Express, Google Gemini API, vanilla HTML/CSS/JavaScript

## Author

Prateek Gupta, [@Prateek-Gupta64](https://github.com/Prateek-Gupta64)
