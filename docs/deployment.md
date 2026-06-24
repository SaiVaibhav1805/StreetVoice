# Deployment and Operations Guide

This document describes how to deploy **StreetVoice** to production or run it locally in dev mode.

## 1. Local Development Setup
Execute these commands to build the services:

```bash
# Clone and setup env variables
# 1. Config server/.env with DB and Cloud keys
# 2. Run MongoDB locally: mongod

# Run Server
cd server
npm install
npm run dev

# Run Client
cd ../client
npm install
npm run dev
```

## 2. Docker Compose Deployment
Boot all services (MongoDB, Redis, Node Backend, and React Client) together:

```bash
docker-compose up --build -d
```

## 3. Production Deployment Notes
- Ensure `NODE_ENV` is set to `production`.
- Use a managed database service like MongoDB Atlas.
- Configure SSL certificates using Nginx or Let's Encrypt for PWA compatibility (PWA service workers require HTTPS connections).
- Configure Cloudinary keys to compress image assets automatically.
