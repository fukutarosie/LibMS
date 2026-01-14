# Library Management System 📚

https://lib-ms-vert.vercel.app/

A complete full-stack Library Management System built with Next.js 14, TypeScript, Prisma ORM, and SQLite. This application provides RESTful APIs and a modern, responsive user interface for managing books, members, and borrowings.

## Features

✅ **Book Management**
- Add, view, and delete books
- Track total and available copies
- Display ISBN, author, and publication year

✅ **Member Management**
- Register new library members
- View member information
- Track membership dates

✅ **Borrowing System**
- Check out books to members
- Track due dates
- Return books
- Highlight overdue borrowings
- Automatically manage book availability

✅ **REST API**
- Complete CRUD operations for books, members, and borrowings
- RESTful endpoints for all operations
- JSON responses

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** SQLite
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Runtime:** Node.js

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client and create database:
```bash
npx prisma generate
npx prisma db push
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
├── app/
│   ├── api/              # REST API routes
│   │   ├── books/        # Book endpoints
│   │   ├── members/      # Member endpoints
│   │   └── borrowings/   # Borrowing endpoints
│   ├── books/            # Books page
│   ├── members/          # Members page
│   ├── borrowings/       # Borrowings page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Seed data (optional)
├── lib/
│   └── prisma.ts         # Prisma client instance
└── public/               # Static assets
```

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Create a new book
- `GET /api/books/[id]` - Get a single book
- `PUT /api/books/[id]` - Update a book
- `DELETE /api/books/[id]` - Delete a book

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create a new member
- `GET /api/members/[id]` - Get a single member
- `PUT /api/members/[id]` - Update a member
- `DELETE /api/members/[id]` - Delete a member

### Borrowings
- `GET /api/borrowings` - Get all borrowings
- `POST /api/borrowings` - Check out a book
- `PUT /api/borrowings/[id]` - Return a book
- `DELETE /api/borrowings/[id]` - Delete a borrowing

## Database Schema

### Book
- id, title, author, isbn, publicationYear
- totalCopies, availableCopies
- timestamps

### Member
- id, name, email, phone, address
- membershipDate, timestamps

### Borrowing
- id, bookId, memberId
- borrowDate, dueDate, returnDate
- status (borrowed/returned)
- timestamps

## Scripts

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Prisma
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database (optional)
```

## Features in Detail

### Book Management
- Add new books with title, author, ISBN, publication year, and number of copies
- View all books in a sortable table
- Track available vs total copies
- Delete books from the system

### Member Management
- Register new members with contact information
- View member details and membership dates
- Manage member database

### Borrowing System
- Check out available books to registered members
- Set due dates for returns
- Visual indication of overdue books (red highlighting)
- Easy return process with single click
- Automatic inventory management

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning or commercial purposes.

---

Built with ❤️ using Next.js and Prisma
