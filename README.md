# Small Web Browser — Full-Stack Single-Page Browser Engine

A client-side web browser engine and application shell built with **Next.js**, **TypeScript**, and **Tailwind CSS** on the frontend, paired with a **NestJS** and **MongoDB** (Mongoose) backend backend service[span_0](start_span)[span_0](end_span).

The application simulates an isolated web ecosystem featuring multi-user session management, real-time visit analytics, snapshot-based navigation history, scroll position restoration, forward-reference truncation, full-text search, and HTML sanitization[span_1](start_span)[span_1](end_span).

---

## 🌟 Features

- **Multi-User Navigation & Context:** Switch seamlessly between active users (`Alice Walker`, `Bob Vance`) while loading persistent user-specific session history stacks[span_2](start_span)[span_2](end_span).
- **Real-Time Visit Logging:** Tracks all navigation events in MongoDB with detailed entry classification (`TYPED`, `LINK`, `JUMP`, `BACK_FORWARD`) and timestamps[span_3](start_span)[span_3](end_span).
- **In-Page Link Interception:** Intercepts standard HTML `<a>` tags to prevent full-page browser reloads, routing navigation through a single-page app engine[span_4](start_span)[span_4](end_span).
- **Custom History Engine & Scroll Restoration:**
  - Fast client-side page transitions via snapshot caching[span_5](start_span)[span_5](end_span).
  - DOM scroll position restoration upon backward/forward navigation[span_6](start_span)[span_6](end_span).
  - Persistent state backup in `sessionStorage`[span_7](start_span)[span_7](end_span).
- **Forward-Reference Truncation:** Implements strict array slicing (`historyStack.slice(0, stackIndex + 1)`) when navigating to new domains after going back, removing abandoned forward history branches per standard browser specification[span_8](start_span)[span_8](end_span).
- **Security & XSS Containment:** Enforces strict HTML sanitization using `DOMPurify` to block malicious `<script>` payloads, inline `onerror` XSS vectors, and layout-breaking `<style>` tags[span_9](start_span)[span_9](end_span).
- **Full-Text Search:** Global search modal powered by MongoDB text indexing across domain titles and HTML body content[span_10](start_span)[span_10](end_span).
- **404 Handling & Dynamic Site Publishing:** Graceful 404 views for unseeded or invalid domains while continuing to record visit history, alongside a dynamic site creation form[span_11](start_span)[span_11](end_span).

---

## 🏗️ Architecture & Tech Stack

### Frontend (`/frontend`)
- **Framework:** Next.js (App Router), TypeScript[span_12](start_span)[span_12](end_span)
- **Styling:** Tailwind CSS, Lucide React Icons[span_13](start_span)[span_13](end_span)
- **Security:** `DOMPurify`[span_14](start_span)[span_14](end_span)

### Backend (`/backend`)
- **Framework:** NestJS, TypeScript[span_15](start_span)[span_15](end_span)
- **Database:** MongoDB via Mongoose ODM[span_16](start_span)[span_16](end_span)
- **Modules:**
  - `SitesModule`: Domain lookup, CRUD operations, full-text indexing[span_17](start_span)[span_17](end_span).
  - `VisitsModule`: Persistent visit logging and analytics[span_18](start_span)[span_18](end_span).
  - `UsersModule`: User accounts and session tracking[span_19](start_span)[span_19](end_span).
  - `SeedModule`: Database resetting and initial data populating[span_20](start_span)[span_20](end_span).

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
