# Safe Dashboard Application

## Overview

This is a modern web application built with React and Express that provides a dashboard for monitoring Safe wallets on Arbitrum blockchain. The application displays wallet balance, transaction history, GitHub repository statistics, and includes Discord webhook integration for alerts.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but not fully implemented)
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **Component Structure**: Uses shadcn/ui design system with Radix UI primitives
- **Routing**: Implemented with Wouter for client-side routing
- **Data Fetching**: TanStack Query for API calls and caching
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with React plugin and TypeScript support

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM configured for PostgreSQL
- **Storage Interface**: Abstracted storage layer with in-memory implementation
- **Development Setup**: Integrated with Vite for hot module replacement

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Basic user table structure defined
- **Migrations**: Configured to output to `./migrations` directory
- **Connection**: Uses environment variable `DATABASE_URL`

### UI Components
- **Design System**: shadcn/ui with "new-york" style variant
- **Icons**: Lucide React icons
- **Accessibility**: Built on Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

1. **Client Requests**: Frontend components use TanStack Query to fetch data
2. **API Integration**: Direct calls to external APIs (Arbitrum, GitHub) from frontend
3. **Server Processing**: Express server handles routing and potential API proxying
4. **Database Operations**: Drizzle ORM manages database interactions (when needed)
5. **State Management**: TanStack Query manages caching and synchronization

## External Dependencies

### Blockchain Integration
- **Arbitrum Network**: For wallet balance and transaction data
- **Arbiscan API**: For blockchain data retrieval

### Third-party Services
- **GitHub API**: For repository statistics
- **Discord Webhooks**: For alert notifications
- **Neon Database**: PostgreSQL hosting (via @neondatabase/serverless)

### Development Tools
- **Replit Integration**: Configured for Replit development environment
- **Vite Plugins**: Runtime error overlay and cartographer for debugging

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend with HMR
- **Type Checking**: `npm run check` for TypeScript validation
- **Database**: `npm run db:push` for schema synchronization

### Production Build
- **Frontend Build**: Vite compiles React app to `dist/public`
- **Backend Build**: ESBuild bundles server to `dist/index.js`
- **Start Command**: `npm start` runs production server

### Environment Configuration
- **Database URL**: Required for PostgreSQL connection
- **API Keys**: Arbitrum/Arbiscan API key for blockchain data
- **Webhook URLs**: Discord webhook for notifications
- **GitHub Integration**: Repository information for stats

### Hosting Considerations
- **Static Assets**: Frontend built to `dist/public` for static hosting
- **Server Deployment**: Node.js server with Express
- **Database**: PostgreSQL (Neon or similar cloud provider)

## Changelog
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.