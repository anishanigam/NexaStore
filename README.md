# NexaStore

NexaStore is a modular, full-stack e-commerce platform built with a modern tech stack. Featuring a Vite-powered frontend, a Node.js/Express backend, and an extensible admin dashboard, NexaStore is designed for rapid development, scalability, and easy customization for any online store or digital marketplace.

---

## Features

- ⚡️ Superfast frontend with [Vite](https://vitejs.dev/)
- 🛠️ Modular backend using Node.js & Express
- 🛒 Ready for e-commerce expansion, with separate admin dashboard
- 🏗️ Organized project structure for easy scaling
- 🚀 Quick start scripts for development and server

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

Clone the repository:
```bash
git clone https://github.com/anishanigam/NexaStore.git
cd NexaStore
```
Install dependencies as needed in each subproject (e.g., frontend, Backend, admin).

### Running the Application

**Frontend (Vite):**
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at [http://localhost:5173](http://localhost:5173) by default.

**Backend (Express Server):**
```bash
cd Backend
npm install
npm run server
```
Backend server will start on the configured port (see `Backend/server.js`).

**Admin Dashboard:**
See [admin directory](./admin/) for admin panel setup instructions.

---

## Project Structure

> Only top-level and first-level folders/files are listed.  
> Some folders may contain many more files and subfolders.  
> For the full structure, browse [the repo on GitHub](https://github.com/anishanigam/NexaStore).

```
NexaStore/
│
├── .vscode/
│   └── settings.json
│
├── Backend/
│   ├── .gitignore
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── admin/
│   ├── package-lock.json
│   └── vite-project/
│
├── frontend/
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public/
│   ├── src/
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md
└── ...
```
[See frontend folder for more details →](https://github.com/anishanigam/NexaStore/tree/main/frontend)  
[See Backend folder for more details →](https://github.com/anishanigam/NexaStore/tree/main/Backend)  
[See admin folder for more details →](https://github.com/anishanigam/NexaStore/tree/main/admin)

---

## Scripts

- `npm run dev` — Start the Vite development server (inside `/frontend`)
- `npm run server` — Start the backend/API server (inside `/Backend`)

---


> Made by Anisha ❤ using [Vite](https://vitejs.dev/)# NexaStore




