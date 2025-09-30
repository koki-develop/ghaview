# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`ghaview` is a CLI tool that visualizes GitHub Actions workflows. It serves a web interface that displays workflow files as interactive flow diagrams.

## Architecture

The project has three main architectural layers:

1. **CLI Layer** (`src/index.ts`): Entry point using Commander.js that starts the server
2. **Server Layer** (`src/server/`): Hono-based HTTP server that:
   - Serves the React frontend in production
   - Provides REST API endpoints (`/api/workflows`) to read and parse YAML workflow files from `.github/workflows/`
3. **Web Layer** (`src/web/`): React application that:
   - Uses React Router for navigation
   - Displays workflows using React Flow (`@xyflow/react`) for graph visualization
   - Uses Mantine UI components for the interface
   - Uses TanStack Query for data fetching

### Key Type Definitions

Core workflow types are defined in `src/lib/types.ts`:
- `WorkflowFile`: Contains filename and parsed workflow data
- `Workflow`: Top-level workflow structure with jobs
- `Job`: Individual job with steps and permissions
- `Step`: Either a `RunStep` (shell commands) or `UsesStep` (actions)

## Development Commands

### Building
```bash
bun run build
```
This runs `scripts/build.ts` which:
1. Cleans the `dist/` directory
2. Builds the CLI as a Node.js executable to `dist/index.js`
3. Builds the React app using Vite to `dist/web/`

### Type Checking
```bash
bun run typecheck
```

### Linting and Formatting
```bash
bun run fmt    # Format and fix issues with Biome
bun run lint   # Check for issues without fixing
```

Pre-commit hooks automatically run `bunx lint-staged` which formats staged files with Biome.

### Development Server
```bash
bun run dev
```
Runs development server on port 3000 with:
- Vite for React hot reloading
- `@hono/vite-dev-server` for API routes
- Tailwind CSS for styling

## Build Configuration

- **TypeScript**: Uses `"moduleResolution": "bundler"` with strict mode enabled
- **Vite**: Configured with React, Tailwind CSS v4, and Hono dev server plugins
- **Production Build**: CLI and web app are bundled separately
  - CLI: Bun.build with Node.js target and external packages
  - Web: Vite build to `dist/web/`
- **Runtime**: Uses Bun for development and build scripts; CLI runs with Node.js in production

## Important Notes

- The server reads workflows from the current working directory's `.github/workflows/` folder
- Workflow YAML parsing is done using the `yaml` package
- The CLI automatically opens the browser when started
- In production, the server serves static files from `dist/web/`
