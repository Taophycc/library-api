# 📚 Library Inventory API

![NodeJS](https://img.shields.io/badge/Node.js-22.x-green.svg?style=flat&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg?style=flat&logo=typescript)
![Fastify](https://img.shields.io/badge/Framework-Fastify-white.svg?style=flat&logo=fastify)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-52b0e7.svg?style=flat&logo=sequelize)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

> A robust RESTful API built with **Fastify**, **Sequelize**, and **TypeScript** for managing library inventory and user requests.

## 📖 Overview
**Library Inventory API** is a backend system designed to bridge the gap between library stock and public demand. Unlike simple CRUD applications, this API implements **smart inventory logic** that distinguishes between what is physically on the shelf and what users are waiting for.

It features a "Supply & Demand" architecture—tracking **Inventory Count** separately from **User Requests**, allowing librarians to identify "Low Supply" books and automatically convert user requests into active inventory when stock is added.

## Key Features
* **📉 Supply vs. Demand:** Tracks physical copies (`count`) and user wishlists (`requests`) in parallel.
* **🧠 Smart Stocking:** Automatically detects if a newly added book fulfills existing user requests.
* **👻 "Ghost Book" Logic:** Creates database entries for requested books even if zero physical copies exist (`count: 0`).
* **🛡️ Safe Deletion:** Implements **Soft Deletes** (Paranoid Mode) to archive books without losing historical data.
* **⚡ High Performance:** Built on **Fastify**, offering low overhead and high throughput compared to Express.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Execution Environment |
| **Framework** | Fastify | High-performance API Framework |
| **Language** | TypeScript | Type Safety & Logic |
| **ORM** | Sequelize | Database Interaction & Modeling |
| **Database** | PostgreSQL | Persistent Data Storage |

## Getting Started

### Prerequisites
* Node.js (v18+)
* **npm** or **pnpm**
* **PostgreSQL** running locally (or SQLite for testing)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/taophycc/library-api.git](https://github.com/taophycc/library-api.git)
    cd library-api
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Setup Database**
    Create a `.env` file (optional) or ensure your local Postgres instance is running. Then run the migrations to create the tables:
    ```bash
    pnpm run db:migrate
    ```

4.  **Run the server**
    ```bash
    pnpm run dev
    ```

## 🔌 API Endpoints

The API is structured around REST principles. Here are the core available routes:

### 📖 Read Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/books` | Retrieve the entire library catalog. |
| `GET` | `/api/books/requested` | **Filter:** Show only books with active user requests (`requests > 0`). |
| `GET` | `/api/books/:id` | Get details of a single book by ID. |

### ➕ Inventory & Request Logic
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/books` | **Librarian Mode:** Adds physical stock. <br>*(Increments `count`. If the book was a "Ghost Entry", it becomes real).* |
| `POST` | `/api/books/request` | **Public Mode:** Request a book. <br>*(Increments `requests`. Creates a "Ghost Entry" with `count: 0` if missing).* |

### ✏️ Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `PUT` | `/api/books/:id` | Update book metadata (Title/Author). |
| `DELETE` | `/api/books/:id` | Soft delete a book (archive it). |

## What I Learned
Building this project solidified my understanding of:
* **Business Logic Implementation:** Creating a "forked" logic flow where one database row can represent two different states (Inventory vs. Request) depending on the route used.
* **ORM Relationships:** Using Sequelize `Model.increment()` and `findOrCreate` to handle atomic updates safely.
* **Route Specificity:** Understanding why specific routes (like `/requested`) must be placed before wildcard routes (`/:id`) to prevent shadowing bugs.
* **REST Architecture:** Separating "Admin" actions (adding stock) from "Public" actions (requesting items) while using the same underlying data model.

## Disclaimer
This project is for educational purposes. It implements a core inventory system but does not yet include User Authentication or Checkout logic (Lending).

---
*Author - Taofeek Kassim ⭐️*