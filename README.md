# Small Web Browser — Full-Stack Single-Page Browser Engine

A client-side web browser engine and application shell built with **Next.js**, **TypeScript**, and **Tailwind CSS** on the frontend, paired with a **NestJS** and **MongoDB** (Mongoose) backend backend service.

The application simulates an isolated web ecosystem featuring multi-user session management, real-time visit analytics, snapshot-based navigation history, scroll position restoration, forward-reference truncation, full-text search, and HTML sanitization.

---

## 🌟 Features

- **Multi-User Navigation & Context:** Switch seamlessly between active users (`Alice Walker`, `Bob Vance`) while loading persistent user-specific session history stacks.
- **Real-Time Visit Logging:** Tracks all navigation events in MongoDB with detailed entry classification (`TYPED`, `LINK`, `JUMP`, `BACK_FORWARD`) and timestamps.
- **In-Page Link Interception:** Intercepts standard HTML `<a>` tags to prevent full-page browser reloads, routing navigation through a single-page app engine.
- **Custom History Engine & Scroll Restoration:**
  - Fast client-side page transitions via snapshot caching.
  - DOM scroll position restoration upon backward/forward navigation.
  - Persistent state backup in `sessionStorage`.
- **Forward-Reference Truncation:** Implements strict array slicing (`historyStack.slice(0, stackIndex + 1)`) when navigating to new domains after going back, removing abandoned forward history branches per standard browser specification.
- **Security & XSS Containment:** Enforces strict HTML sanitization using `DOMPurify` to block malicious `<script>` payloads, inline `onerror` XSS vectors, and layout-breaking `<style>` tags.
- **Full-Text Search:** Global search modal powered by MongoDB text indexing across domain titles and HTML body content.
- **404 Handling & Dynamic Site Publishing:** Graceful 404 views for unseeded or invalid domains while continuing to record visit history, alongside a dynamic site creation form.

---

## 🏗️ Architecture & Tech Stack

### Frontend (`/frontend`)
- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **Security:** `DOMPurify`

### Backend (`/backend`)
- **Framework:** NestJS, TypeScript
- **Database:** MongoDB via Mongoose ODM[
- **Modules:**
  - `SitesModule`: Domain lookup, CRUD operations, full-text indexing
  - `VisitsModule`: Persistent visit logging and analytics.
  - `UsersModule`: User accounts and session tracking
  - `SeedModule`: Database resetting and initial data populating

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **MongoDB**: Local instance running at `mongodb://127.0.0.1:27017/small-web` OR a MongoDB Atlas connection string.

---

### 1. Backend Setup & Database Seeding

Navigate to the `backend/` folder, install dependencies, seed the database, and start the development server:

```bash
cd backend

# Install dependencies
npm install

# Configure Environment Variables
# Create a .env file if necessary:
# MONGODB_URI=mongodb://127.0.0.1:27017/small-web

# Seed initial database (10 sites, 3 users, 1-hour history log)
npm run seed

# Start NestJS Backend Server (runs on http://localhost:3001)
npm run start:dev
