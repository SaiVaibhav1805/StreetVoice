# StreetVoice Environment Variables & Deployment Reference

## 🌐 Frontend (Vercel)

For **Vercel**, you **only need 1 environment variable**:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://streetvoice-api.onrender.com/api` | The backend API endpoint URL hosted on Render |

*Why only one?* 
Vite compiles all React frontend code into static assets. The browser only needs to know where your backend server lives (`VITE_API_URL`). All sensitive keys stay safely on the server!

---

## ⚙️ Backend (Render)

For **Render**, you will set all your server configuration and secret keys:

| Key | Value / Example | Description |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB database connection string |
| `JWT_SECRET` | `your_jwt_secret` | Secret key for JWT authentication tokens |
| `CLOUDINARY_CLOUD_NAME` | `diycl6yle` | Cloudinary cloud name for media uploads |
| `CLOUDINARY_API_KEY` | `283885116837566` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `dMRIrWjXZhISlBTaIm0tsqWCRQc` | Cloudinary API secret |
| `CLIENT_URL` | `https://streetvoice.vercel.app` | Allowed CORS origin (your Vercel frontend URL) |
| `PORT` | `5000` | (Optional) Render handles port automatically |

---

## 🚀 Quick Step-by-step Setup

### 1. Render Setup (Backend)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Add the **Backend Environment Variables** listed above.

### 2. Vercel Setup (Frontend)
- **Framework Preset**: Vite
- **Root Directory**: `client`
- Add **`VITE_API_URL`** pointing to your Render backend API (`https://<your-render-app>.onrender.com/api`).
