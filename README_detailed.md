# SeeVeChain: Real-Time VeChain Blockchain Visualizer

## Overview

SeeVeChain is a real-time visualizer and analytics platform for the VeChain public blockchain. It provides instant, interactive visualizations of on-chain activity, including live transaction flows, VTHO burn statistics, and contract activity, all rendered in a visually engaging interface. The application is designed for both technical and non-technical users who want to explore, analyze, or simply observe the dynamic activity of the VeChain blockchain.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Core Components](#core-components)
- [Database & Migrations](#database--migrations)
- [Setup & Installation](#setup--installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Customization](#customization)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

---

## Features
- **Real-time Blockchain Visualization:**
  - Live display of VeChain transactions as interactive, animated circles on a starfield background.
  - Visualization of VTHO burn, transaction counts, and contract activity.
- **Analytics Dashboard:**
  - Daily, weekly, and historical stats for VTHO burn, transaction count, and clause count.
  - Top contracts by activity and burn.
- **Interactive UI:**
  - Responsive, modern interface built with React/Preact and Material UI.
  - Charts (using Chart.js) for historical and real-time data.
- **Backend Processing:**
  - Real-time ingestion of VeChain blockchain data using Connex Framework.
  - Efficient storage and caching of blocks, transactions, and analytics in PostgreSQL.
- **Socket.IO Integration:**
  - Pushes live updates to all connected clients instantly.
- **Extensible & Customizable:**
  - Modular design for easy feature extension and refactoring.
  - Settings system for UI and data customization.

---

## Architecture

- **Frontend:**
  - Built with Preact (React-compatible), Material UI, Chart.js.
  - Main entry: `client/Main.js`, rendered via `client/index.js`.
  - Components for visualization, analytics, charts, and UI controls.
- **Backend:**
  - Node.js + Express server (`server/app.js`), with Socket.IO for real-time communication.
  - Blockchain data ingestion via `@vechain/connex-framework` and `@vechain/connex.driver-nodejs`.
  - Data processing, analytics, and scheduled jobs (via `node-cron`).
- **Database:**
  - PostgreSQL for persistent storage.
  - Managed and migrated with `db-migrate` scripts and `migrations/` directory.
- **Scripts:**
  - Utility scripts for database setup, migration, block fetching, and maintenance in `scripts/`.
- **Shared:**
  - Common data (e.g., known contract addresses) in `shared/` for both client and server use.

---

## Directory Structure

```
seevechain/
├── client/         # Frontend source code (Preact/React, components, assets, charts)
├── server/         # Backend code (Express, Socket.IO, blockchain ingestion, analytics)
├── migrations/     # Database migration scripts (db-migrate)
├── scripts/        # Utility and maintenance scripts (setup, block fetching, etc.)
├── shared/         # Shared JS modules (e.g., knownAddresses.js)
├── package.json    # Project dependencies and scripts
├── webpack.config.js # Webpack build configuration
├── environment.js  # Environment setup
├── .env            # Local environment variables (not checked in)
└── ...
```

### Notable Files & Directories
- `client/components/Visualizer/`: Main visualization logic and UI.
- `client/components/Analytics/`: Analytics dashboard (lazy-loaded).
- `server/app.js`: Express app, middleware, error handling, and Socket.IO integration.
- `server/lib/connex.js`: Blockchain connection and block ingestion logic.
- `server/commands/`: Data processing commands (saveBlock, saveTransaction, etc).
- `server/actions/`: Analytics and visitor tracking actions.
- `migrations/`: Database schema evolution scripts.
- `scripts/start`: Entry point for server and blockchain sync.
- `shared/knownAddresses.js`: List of known VeChain contract addresses and labels.

---

## Core Components

### 1. Frontend (Visualizer & Analytics)
- **Visualizer:**
  - Renders a starfield background with animated transaction circles sized by VTHO burn.
  - Displays real-time stats: transactions, VTHO burn, clauses, top contracts.
  - Receives data via Socket.IO from the backend.
- **Analytics:**
  - Provides historical charts (daily/weekly) for VTHO burn, transaction count, clause count, and USD value.
  - Accessible at `/analytics` route.
- **UI/UX:**
  - Responsive design, mobile-friendly.
  - Controls for toggling sound, viewing contract details, and more.

### 2. Backend (Data Ingestion & API)
- **Blockchain Listener:**
  - Uses Connex to connect to VeChain mainnet and subscribe to new blocks.
  - For each block, fetches all transactions, parses clauses, computes VTHO burn and USD value.
  - Stores data in PostgreSQL and caches latest block/analytics in memory.
- **REST & Socket.IO API:**
  - `/api/visitor_analytics`: Returns visitor analytics.
  - Socket.IO events:
    - `clientAskForLatest` → `serverSendLatest`: Sends latest processed block and analytics.
    - `clientAskForWeekly` → `serverSendTopContracts`: Sends top contracts and stats.
- **Scheduled Jobs:**
  - Daily stats aggregation and old block cleanup (via cron jobs).

### 3. Database
- **Tables:**
  - `blocks`, `transactions`, `clauses`, `daily_stats`, `caches`, `unique_visitors`, etc.
- **Migrations:**
  - All schema changes are tracked in the `migrations/` directory and managed with `db-migrate`.

---

## Setup & Installation

### Prerequisites
- Node.js (v12.16.x)
- npm
- PostgreSQL
- Linux (recommended)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Smuzzies/seevechain.git
   cd seevechain/
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:seevechain@localhost/seevechain
   PORT=1337
   TIME_DIFFERENCE=0
   NODE_ENV=development
   ```
4. Set up the database:
   ```bash
   sudo -u postgres ./scripts/db-setup
   ```
5. Build and start the development server:
   ```bash
   npm run start:dev
   ```

---

## Configuration

- **.env file**: Place in the project root. Controls DB connection, port, time difference, and environment.
- **Webpack**: Configured for both development and production builds (`webpack.config.js`).
- **Settings**: UI and backend settings can be extended in code (see `refactor.txt` for ideas).

---

## Usage
- Visit the root URL to see the live blockchain visualizer.
- Visit `/analytics` for historical analytics and charts.
- Use the UI to explore top contracts, VTHO burn, and more.
- Developers: Use the browser console for advanced inspection (e.g., `getFriendlyNames()`).

---

## Customization
- **UI/UX**: Modify or extend components in `client/components/`.
- **Blockchain Data**: Adjust ingestion or analytics logic in `server/commands/` and `server/lib/connex.js`.
- **Database**: Add new migrations for schema changes.
- **Settings**: Extend settings in code and persist in DB for runtime changes.

---

## Development
- Linting: ESLint with React/Preact rules (`.eslintrc.js`).
- Build: Webpack for JS/CSS/assets.
- Scripts: Utility scripts for DB and blockchain maintenance in `scripts/`.
- Testing: (Minimal, add as needed.)

---

## Troubleshooting
- If the UI does not load, check server logs and ensure PostgreSQL is running.
- For database issues, verify `.env` and run migrations.
- For real-time data, ensure the backend is connected to the VeChain mainnet.
- See `logs.txt` for application logs.

---

## Credits
- Built by Smuzzies and contributors.
- Uses VeChain Connex, Material UI, Chart.js, and more.

---

## Further Reading
- See `refactor.txt` for architectural notes and ideas for future improvements.
- Explore `shared/knownAddresses.js` for a list of labelled VeChain contract addresses.

---

_Last updated: 2025-04-23_
