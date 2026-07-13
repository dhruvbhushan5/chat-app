# Deployment Guide for Snappy Chat App

This project has three pieces:

1. **Frontend React app** in `public` - this can stay on Vercel.
2. **Backend Node/Express app** in `server` - deploy this separately on Render, Railway, or a VPS.
3. **MySQL database** - use a local MySQL server for development, and a cloud MySQL database for deployment.

Vercel frontend cannot use `http://localhost:5000` after deployment. In production, `localhost` means the Vercel server/user browser itself, not your computer. You must point `REACT_APP_API_URL` to your deployed backend URL.

## Local Setup

1. Start MySQL on your computer.
   - If you use XAMPP/WAMP, start MySQL from its control panel.
   - If you installed MySQL as a Windows service, start the MySQL service.

2. Check `server/.env`:

```env
PORT=5000
MYSQL_DB="chat_app"
MYSQL_USER="root"
MYSQL_PASSWORD=""
MYSQL_HOST="localhost"
```

3. Check `public/.env`:

```env
REACT_APP_LOCALHOST_KEY="chat-app-current-user"
REACT_APP_API_URL="http://localhost:5000"
```

4. Run:

```bat
start_project.bat
```

The script creates the MySQL database if needed, then starts backend on port `5000` and frontend on port `3000`.

## Production Deployment

### Step 1: Create a Cloud MySQL Database

Use a provider such as Railway, Aiven, PlanetScale, or any MySQL host.

You need these values:

```env
MYSQL_DB=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_HOST=
```

### Step 2: Deploy the Backend

Deploy the `server` folder to Render, Railway, or another Node.js host.

Recommended backend settings:

- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

Set these backend environment variables:

```env
PORT=5000
MYSQL_DB=your_cloud_database_name
MYSQL_USER=your_cloud_database_user
MYSQL_PASSWORD=your_cloud_database_password
MYSQL_HOST=your_cloud_database_host
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

After deployment, copy the backend URL, for example:

```text
https://your-chat-backend.onrender.com
```

### Step 3: Connect Vercel Frontend to Backend

In Vercel:

1. Open your frontend project.
2. Go to **Settings** > **Environment Variables**.
3. Add or update:

```env
REACT_APP_API_URL=https://your-chat-backend.onrender.com
REACT_APP_LOCALHOST_KEY=chat-app-current-user
```

Do not use `http://localhost:5000` on Vercel.

4. Redeploy the frontend after changing environment variables.

## Quick Checklist

- Local app: MySQL running on your computer.
- Vercel app: `REACT_APP_API_URL` points to deployed backend, not localhost.
- Backend host: has MySQL environment variables.
- Cloud database: accepts connections from the backend host.
