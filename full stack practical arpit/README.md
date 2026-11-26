# Seven Beginner-Friendly Web Development Projects

Each numbered folder is a separate project. Open a terminal inside the project folder before running commands.

## Requirements
- Node.js (LTS) and npm
- MongoDB Community Server or a MongoDB Atlas connection for projects 5 and 6

## Run a project
For projects 1–6:
```bash
npm install
npm start
```
Open the localhost address printed in the terminal. Ports are 3001 through 3006.

For project 7:
```bash
npm install
npm run dev
```
Open the Vite address printed in the terminal.

## MongoDB projects (5 and 6)
1. Start your local MongoDB server, or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env`.
3. Put your MongoDB connection string in `MONGO_URI`.
4. Run `npm install` and `npm start`.

## Important notes
- Projects 3 and 4 use in-memory sample data. Their data resets when the server restarts.
- Project 5 stores products in MongoDB.
- Project 6 stores products and orders in MongoDB. Checkout is a **demo only**: it records an order and does not take real payments. Do not use it for real customers or real card details.
- Project 2 forms demonstrate GET/POST routes; login and registration are not secure authentication systems.
- Replace sample names, email addresses, and portfolio text with your own details.
- These are simple educational starting projects. Add validation, authentication, security, and production configuration before deployment.
