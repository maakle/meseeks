# Messeks

Before you proceed, please first watch this:

### What is this project?

[![WhatsApp AI Chatbot](https://i.imgur.com/QaeRc4l.png)](https://www.youtube.com/watch?v=l5wvqKcqL7c)

### In a nutshell

This API summons meseeks via a REST API. You can give them a simple task and watch them complete it by reaching out to their target via WhatsApp.

But remember, keep your requests simple. They're not gods!


## Getting Started

1. **Install Node.js:** Download and install the latest version of Node.js from [https://nodejs.org/](https://nodejs.org/).

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**

    - Set up environment variables for API keys (OpenAI, WhatsApp API provider), database credentials (Postgres), and other necessary configurations.

4. **Run the API:**

    - **Development Mode:**
      ```bash
      pnpm dev
      ```
      This command starts the app in development mode with file watching for changes.

    - **Debug Mode:**
      ```bash
      npm run start:debug
      ```
      This command starts the chatbot in debug mode with file watching for changes, enabling you to use a debugger.

    - **Production Mode:**
      ```bash
      npm run start:prod
      ```
      This command starts the chatbot in production mode, optimized for performance and stability.

## Connecting Your Backend To WhatsApp:

- **No third-party providers needed!** You can directly integrate with the WhatsApp Cloud API by following these steps:
   1. Create a Facebook Developer account at [https://developers.facebook.com/](https://developers.facebook.com/).
   2. Create a WhatsApp Business account and integrate it with your Facebook Developer account.
   3. Follow the official WhatsApp Cloud API documentation to configure your chatbot. (details to be saved to your environment file)


**Testing (Contributions are welcome - running by grace, no tests):**

* **Unit Tests:**

   ```bash
   npm run test
   ```

* **End-to-End (E2E) Tests:**

   ```bash
   npm run test:e2e
   ```

## Support and Contribution

We welcome contributions and feedback. If you encounter issues or have suggestions, please open an issue on GitHub.

