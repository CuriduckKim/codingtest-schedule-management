# README.md

This project was created using `Arkain's AI Quick Start` feature.

## Environment and Technology Stack

| Component               | Version         |
|-------------------------|------------------|
| OS                      | Ubuntu 22.04     |
| Node.js                 | 20.18.3          |
| npm                     | 10.8.2           |
| Framework               | NestJS           |
| Language                | TypeScript       |
| Cron Jobs               | @nestjs/schedule  |
| Google APIs             | googleapis       |
| Slack SDK               | @slack/web-api   |

## Project Creation Summary

- Created a project directory and set ownership.
- Initialized the codebase with necessary configuration files.
- Set up the main application and modules for event management.
- Integrated services for Google Calendar, Google Sheets, and Slack notifications.
- Installed project and development dependencies.
- Built the TypeScript application.
- Started the NestJS application.

## Running the Project

To run the project, follow these steps:

1. Ensure you have Node.js and npm installed.
2. Clone the repository and navigate to the project directory.
3. Install the project dependencies:
   bash
   npm install @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/schedule @slack/web-api googleapis dotenv
   ```
4. Install development dependencies:
   ```bash
   npm install -D typescript @types/node @nestjs/cli @types/express ts-node
   ```
5. Build the TypeScript application:
   ```bash
   npm run build
   ```
6. Start the application:
   ```bash
   NODE_ENV=production node dist/main.js
   ```

### Potential Errors and Solutions

- **Error: "Cannot find module"**: Ensure all dependencies are installed correctly. Run `npm install` again.
- **Error: "Permission denied"**: Check the ownership of the project directory and ensure you have the necessary permissions.

From the top menu, navigate to 'Container -> Execution URL and Port -> Registered URL and Port -> Click the shortcut button on the selected row.'

## Directory Structure

```
event-management-backend
├── src
│   ├── app.module.ts
│   ├── events
│   │   ├── events.controller.ts
│   │   ├── events.module.ts
│   │   └── events.service.ts
│   └── services
│       ├── google-calendar.service.ts
│       ├── google-sheets.service.ts
│       └── slack.service.ts
├── .env.example
├── package.json
└── tsconfig.json
```
```