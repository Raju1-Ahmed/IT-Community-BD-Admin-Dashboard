# IT Community BD Admin Dashboard

Administrative dashboard for managing platform operations in IT Community BD. This app is intended for internal/admin usage and complements the public frontend and backend API.

## What This Dashboard Is For

- Reviewing and managing admin-only flows
- Monitoring records and operational pages
- Handling platform management tasks that should stay outside the public client

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React

## Project Structure

```text
src/
  assets/   Static assets
  pages/    Admin pages
  api.js    Axios client configuration
  App.jsx   Route composition
  main.jsx  App entry
```

## Prerequisites

- Node.js 18+
- npm
- Running backend API from the server repo

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Development Notes

- API requests are configured in `src/api.js`.
- Keep admin-only features separate from the public frontend.
- When adding new admin pages, make sure the corresponding backend endpoints are protected appropriately.

## Related Repositories

- `IT-Community-BD-server` - backend API
- `IT-Community-BD-Frontend` - public-facing application
