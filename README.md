## Project Overview

This project integrates **Godot 4**, **ReactJS**,  and **AOS (the Operating System for AO: The Hyper-Parallel Computer on **Arweave**,)** to create a decentralized game with hyper-parallel computing capabilities and permanent data storage.

### Key Technologies
- **Godot 4**: Handles game logic, rendering, and interacts with the browser using `JavaScriptBridge`.
- **ReactJS**: Frontend UI that communicates with Godot and exposes JavaScript functions like `window.userAddress` or soon checkNbOfTikets() and collectFLOPPY() . the front-end communicates wth AOS for leaderboard, chat functions
- **Arweave**: Permanent decentralized storage using **arDrive** for game assets and user chat toen data.
- **AOS**: Hyper-parallel computing platform to offload heavy computations across decentralized nodes.

### Architecture Overview
1. **Godot 4 Backend**: 
   - Game logic, UI updates, and score management are handled in Godot. The game interacts with the ReactJS frontend using `JavaScriptBridge` to fetch user information (e.g., collecting coin, ) and other data.
   - Example: Godot calls a JavaScript function in the browser to fetch `window.userAddress` (soon calling aos methods or soon checkNbOfTikets() and collectFLOPPY()) and stores it in a GDScript variable.

2. **ReactJS Frontend**: 
   - Powers the UI, connecting with the user and blockchain.
   -  Communicates wth AOS for leaderboard, chat function
   - cpde project uploaded on Arweave to store game-related data and assets permanently, ensuring decentralized access and integrity.
   - ReactJS exposes necessary browser-side JavaScript functions that Godot accesses to fetch data like user addresses.

3. **Arweave Storage**: 
   - Game data such as assets, user progress, and metadata are stored on **Arweave** using the **arDrive** library, ensuring that data is permanently stored and retrievable.
   - This enables a decentralized and tamper-proof system where game assets and user data cannot be lost or altered by central authorities.

4. **AOS Hyper-Parallel Computing**:
   - **AOS** offloads computationally expensive tasks to a decentralized, parallel computing network. This allows for efficient handling of backend processes such as game logic, artificial intelligence, or blockchain interactions.
   - AOS enables scalability by distributing game-related tasks across multiple nodes, which is particularly useful for handling large-scale or resource-intensive processes.

### Key Features
- **Godot-ReactJS Integration**: Using `JavaScriptBridge`, Godot seamlessly interacts with the browser, fetching data like wallet addresses or aos methods from ReactJS and updating the game state.
- **Decentralized Storage**: All game assets and user data are stored on Arweave, leveraging the immutability and persistence of decentralized storage.
- **Hyper-Parallel Execution**: AOS enables the game to run complex operations in parallel, improving efficiency and performance.

This project demonstrates how modern web technologies, decentralized storage, and parallel computing can be integrated to create a scalable, decentralized game with persistent data and high performance.

![alt text](https://github.com/coneheadsquid/coneheadsquid-game/blob/master/Screenshot.jpg)

----------------------------------------------------------------------------------------
# React + Vite + TypeScript Template (react-vite-ui)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Dan5py/react-vite-ui/blob/main/LICENSE)

A React + Vite template powered by shadcn/ui.

## 🎉 Features

- **React** - A JavaScript library for building user interfaces.
- **Vite** - A fast, opinionated frontend build tool.
- **TypeScript** - A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS** - A utility-first CSS framework.
- **Tailwind Prettier Plugin** - A Prettier plugin for formatting Tailwind CSS classes.
- **ESLint** - A pluggable linting utility for JavaScript and TypeScript.
- **PostCSS** - A tool for transforming CSS with JavaScript.
- **Autoprefixer** - A PostCSS plugin to parse CSS and add vendor prefixes.
- **shadcn/ui** - Beautifully designed components that you can copy and paste into your apps.

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (version 16 or above)
- pnpm (package manager)

## 🚀 Getting Started

Follow these steps to get started with the react-vite-ui template:

1. Clone the repository:

   ```bash
   git clone https://github.com/dan5py/react-vite-ui.git
   ```

2. Navigate to the project directory:

   ```bash
   cd react-vite-ui
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

## 📜 Available Scripts

- pnpm dev - Starts the development server.
- pnpm build - Builds the production-ready code.
- pnpm lint - Runs ESLint to analyze and lint the code.
- pnpm preview - Starts the Vite development server in preview mode.

## 📂 Project Structure

The project structure follows a standard React application layout:

```python
react-vite-ui/
  ├── node_modules/      # Project dependencies
  ├── public/            # Public assets
  ├── src/               # Application source code
  │   ├── components/    # React components
  │   │   └── ui/        # shadc/ui components
  │   ├── styles/        # CSS stylesheets
  │   ├── lib/           # Utility functions
  │   ├── App.tsx        # Application entry point
  │   └── index.tsx      # Main rendering file
  ├── .eslintrc.json     # ESLint configuration
  ├── index.html         # HTML entry point
  ├── postcss.config.js  # PostCSS configuration
  ├── tailwind.config.js # Tailwind CSS configuration
  ├── tsconfig.json      # TypeScript configuration
  └── vite.config.ts     # Vite configuration
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.
