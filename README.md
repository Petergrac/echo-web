# Echo Web

Echo Web is the **Next.js frontend for Echo**, a social media platform powered by a NestJS backend. It connects with the `echo-backend` API to let users authenticate, explore feeds, create content, and interact with others in real time.

This project is built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, and is designed to be clean, fast, and scalable.

---

## Features

- User authentication (login & signup)
- Feed browsing and content interaction
- Responsive UI for desktop and mobile
- Modern React patterns with Next.js App Router
- Tailwind CSS for styling

---

## Tech Stack

- **Next.js** – framework for UI and routing
- **React** – UI library
- **TypeScript** – type safety
- **Tailwind CSS** – utility-first styling
- **Fetch / Axios** – backend API communication

---

## Getting Started

### Prerequisites

Make sure you have:

- Node.js (v16+ recommended)
- pnpm, npm, or yarn
- The Echo backend running

---

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Petergrac/echo-web.git
cd echo-web
```

2. Install dependencies:

```bash
pnpm install
# or npm install
# or yarn
```

3. Create an environment file:

```bash
touch .env.local
```

Add the backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Replace the URL if your backend runs elsewhere.

4. Start the development server:

```bash
pnpm dev
# or npm run dev
# or yarn dev
```

5. Open in your browser:

```bash
http://localhost:3000
```

---

## Environment Variables

| Variable            | Description                      |
| ------------------- | -------------------------------- |
| NEXT_PUBLIC_API_URL | Base URL of the Echo backend API |

---

## Project Structure

```bash
app/        # Next.js routes and layouts
src/        # Components, hooks, utilities
public/     # Static assets
styles/     # Global styles
```

---

## Backend Integration

This frontend consumes the Echo backend API built with NestJS:

[https://github.com/Petergrac/echo-backend](https://github.com/Petergrac/echo-backend)

Make sure:

- The backend is running
- CORS allows requests from your frontend domain
- The API URL is correctly set in `.env.local`

The backend handles authentication, posts, likes, comments, notifications, and real-time features.

---

## Deployment

You can deploy this project on platforms like:

- Vercel
- Netlify
- Cloudflare Pages

Steps:

1. Push the repository to your hosting provider
2. Set `NEXT_PUBLIC_API_URL` in environment variables
3. Build command:

```bash
pnpm build
```

4. Start command:

```bash
pnpm start
```

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Open a pull request

---

## Troubleshooting

If the app does not work as expected:

- Confirm the backend is running
- Check `.env.local` values
- Inspect network requests in DevTools
- Verify API endpoints still match the backend

---

## What you can add?
There are some endpoints that i did not implement like.
 - Post Update.
 - Admin routes.

## License

MIT (or specify if different)
