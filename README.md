# Messeks

Before you proceed, please first watch this:

### What is this project?

[![WhatsApp AI Chatbot](https://i.imgur.com/QaeRc4l.png)](https://www.youtube.com/watch?v=l5wvqKcqL7c)

### In a nutshell

This Application summons meseeks via a REST API. You can give them a simple task and watch them complete it by reaching out to their target via WhatsApp.

But remember, keep your requests simple. They're not gods!

## Project Structure

This is a monorepo built with Turborepo, containing the following main applications:

- `apps/frontend`: Next.js frontend application
- `apps/api`: NestJS backend API
- `packages/`: Shared packages and utilities

## Getting Started

1. **Prerequisites:**
   - Node.js (Latest LTS version recommended)
   - pnpm (Latest version)

2. **Install Dependencies:**

   ```bash
   # Install dependencies for all workspaces
   pnpm install
   ```

3. **Environment Setup:**

   Create and configure the following environment files:

   - For the API please look there is a example file `apps/api/.env.example` copy it to `apps/api/.env` and fill the variables
     ```env
      JWT_SECRET=*** # Genreate with: openssl rand -base64 32
      DATABASE_URL=***
      SERVER_URL=***
      # ... dnd more
     ```

   - For the frontend please look there is a example file `apps/frontend/.env.example` copy it to `apps/frontend/.env` and fill the variables
     ```env
      NEXT_PUBLIC_API_URL="http://localhost:3001"
      # ... and more
     ```

4. **Database Setup:**

   ```bash
   # Navigate to the API directory
   cd apps/api
   
   # Run database migrations
   pnpm prisma migrate dev
   ```

5. **Running the Applications:**

   ```bash
   # Run both frontend and API in development mode from the main folder
   pnpm dev
   
   # Or run them separately:
   
   # Run API only
   pnpm --filter api dev
   
   # Run Frontend only
   pnpm --filter frontend dev
   ```

## Development Workflow

- **API Development:**
  - The API runs on `http://localhost:3001`
  - Uses NestJS with Prisma for database operations
  - API documentation is available at `/api/docs` when running in development mode

- **Frontend Development:**
  - The frontend runs on `http://localhost:3000`
  - Built with Next.js and modern UI frameworks

## Connecting Your Backend To WhatsApp:

1. Create a Facebook Developer account at [https://developers.facebook.com/](https://developers.facebook.com/)
2. Create a WhatsApp Business account and integrate it with your Facebook Developer account
3. Configure your WhatsApp Cloud API credentials in `apps/api/.env`

## Testing

* **Unit Tests:**
   ```bash
   # Run tests for all workspaces
   pnpm test
   
   # Run tests for specific workspace
   pnpm --filter api test
   pnpm --filter frontend test
   ```

* **End-to-End (E2E) Tests:**
   ```bash
   pnpm test:e2e
   ```

## Support and Contribution

We welcome contributions and feedback. If you encounter issues or have suggestions, please open an issue on GitHub.

