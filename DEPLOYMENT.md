# Deploy to Vercel

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and log in.
3.  **Add New Project**: Click "Add New..." -> "Project".
4.  **Import Repository**: Select your `TweetUI` repository.
5.  **Configure Project**:
    *   **Framework Preset**: Select `Angular`.
    *   **Root Directory**: Leave as `./` (default).
    *   **Build Command**: `ng build` (default).
    *   **Output Directory**: `dist/TweetUI/browser`.
    *   **Install Command**: `npm install` (default).
6.  **Deploy**: Click "Deploy".
7.  **Verify**: Once deployed, visit the provided URL to ensure the application loads and routing works (e.g., refresh on `/login`).

> [!NOTE]
> A `vercel.json` file has been added to the project root to handle client-side routing rewrites.
