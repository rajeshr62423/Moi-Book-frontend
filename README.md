Moi-Book Frontend

Moi-Book frontend built using Next.js with a Microservice Architecture.

Getting Started

This project is built with Next.js
and bootstrapped with create-next-app
.

Prerequisites

Make sure you have the following installed:

Node.js
npm
Installation

Clone the repository and install the dependencies:

git clone https://github.com/rajeshr62423/Moi-Book-frontend.git
cd Moi-Book-frontend
npm install

Development Server

Start the development server:

npm run dev

You can also use:

yarn dev

or:

pnpm dev

or:

bun dev

Open http://localhost:3000
in your browser.

The application will automatically update when you modify the source files.

Project Structure

The frontend follows a modular architecture designed to work with backend microservices.

Moi-Book-frontend/
├── app/
├── components/
├── public/
├── .claude/
├── CLAUDE.md
├── AGENTS.md
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

The exact project structure may change as the application grows.

Tech Stack
Next.js
React
TypeScript
Tailwind CSS
Microservice Architecture
Available Scripts
Development
npm run dev

Runs the application in development mode.

Production Build
npm run build

Creates an optimized production build.

Start Production Server
npm start

Starts the application using the production build.

Lint
npm run lint

Runs the project's linting checks.

Environment Variables

Environment-specific configuration should be stored in .env files.

For example:

NEXT_PUBLIC_API_URL=http://localhost:8080

Do not commit environment files containing secrets, API keys, passwords, tokens, or other sensitive information.

Environment files are excluded through .gitignore.

Microservice Architecture

Moi-Book is designed to communicate with backend services through APIs.

The frontend is responsible for:

User interface
Client-side interactions
Authentication flows
API communication
Data presentation
Form handling
Frontend validation

Backend responsibilities are handled by the corresponding microservices.

Fonts

This project uses next/font
for optimized font loading.

The default project configuration uses the Geist font family.

Learn More

To learn more about Next.js, check out the following resources:

Next.js Documentation
Next.js Learn
Next.js GitHub Repository
Deployment

The easiest way to deploy a Next.js application is using Vercel.

You can also deploy the application to other platforms that support Node.js and Next.js.

For more information, see the Next.js deployment documentation
.

Repository

GitHub repository:

https://github.com/rajeshr62423/Moi-Book-frontend

Moi-Book Frontend — Next.js + Microservice Architecture
