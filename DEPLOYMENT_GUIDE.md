# Deployment Guide for Chat App

Your chat application has two parts:
1. **Frontend (React)**: Currently deployed on Vercel.
2. **Backend (Node.js/Express)**: Needs to be deployed separately (e.g., on Render or Railway) because Vercel is optimized for frontend/static sites and doesn't support persistent Node.js servers with WebSockets easily.
3. **Database (MongoDB)**: Needs a cloud-hosted database (e.g., MongoDB Atlas).

## Step 1: Set up MongoDB Atlas (Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new Cluster (the free tier is fine).
3. In "Database Access", create a database user (username and password).
4. In "Network Access", allow access from anywhere (0.0.0.0/0).
5. Click "Connect" > "Connect your application" and copy the connection string (it looks like `mongodb+srv://<username>:<password>@cluster0.net/...`).
6. Replace `<password>` with your actual password.

## Step 2: Deploy the Backend (Server)

We recommend using **Render** as it supports Node.js and WebSockets easily.

1. Push your code to a GitHub repository if you haven't already.
2. Go to [Render](https://render.com/) and create a "Web Service".
3. Connect your GitHub repository.
4. Configure the service:
   - **Root Directory**: `server` (Important! This tells Render the backend is in the server folder)
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js` (or `npm start`)
5. **Environment Variables**: Add the following keys:
   - `MONGO_URL`: The connection string from Step 1.
   - `PORT`: `5000` (or let Render assign one, usually it ignores this and assigns its own).
   - `CORS_ORIGIN`: `https://chat-app-nine-topaz-10.vercel.app` (This allows your Vercel frontend to talk to the backend).
6. Click "Create Web Service".
7. Once deployed, copy the **URL** (e.g., `https://chat-app-backend.onrender.com`).

## Step 3: Connect Frontend to Backend

Now you need to tell your Vercel frontend where the backend lives.

1. Go to your Vercel project dashboard.
2. Go to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: The URL of your deployed backend from Step 2 (e.g., `https://chat-app-backend.onrender.com`). Do not add a trailing slash.
4. **Redeploy** your frontend (go to Deployments > Redeploy) for the changes to take effect.

## Summary

- **Frontend**: Talks to `REACT_APP_API_URL`.
- **Backend**: Listens for requests from `CORS_ORIGIN`.
- **Database**: Backend connects to `MONGO_URL`.

Once these are linked, your app should work!
