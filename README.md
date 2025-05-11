# NT Scoreboard Lovable

A modern, interactive scoreboard application built with React, Vite, TypeScript, and Shadcn/UI.

## Screenshot

![App Screenshot](/public/screenshot.png)

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **UI Components:** Shadcn/UI (built on Radix UI primitives)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Forms:** React Hook Form with Zod for validation
- **Linting:** ESLint
- **Package Manager:** npm / Bun (supports both)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (LTS version recommended)
- Bun (Optional, but recommended if you prefer using Bun)

## Installation

1. **Clone the repository (if applicable):**
    ```bash
    git clone https://github.com/vnt87/nt-scoreboard
    cd nt-scoreboard
    ```

2. **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```
    Or using Bun:
    ```bash
    bun install
    ```

## Running the Project

To start the development server:

Using npm:
```bash
npm run dev
```
Or using Bun:
```bash
bun dev
```
This will typically start the application on `http://localhost:8080` (Vite's default port, but check your terminal output).

## Available Scripts

In the project directory, you can run the following scripts:

- `npm run dev` or `bun dev`: Starts the development server.
- `npm run build` or `bun build`: Builds the app for production to the `dist` folder.
- `npm run build:dev` or `bun run build:dev`: Builds the app for development (includes source maps, etc.).
- `npm run lint` or `bun lint`: Lints the codebase using ESLint.
- `npm run preview` or `bun preview`: Serves the production build locally for preview.

---

This project was bootstrapped with Vite and uses Shadcn/UI for its component library.
