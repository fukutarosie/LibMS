import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all books
export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

// POST - Create a new book
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, isbn, publicationYear, totalCopies } = body;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        publicationYear: parseInt(publicationYear),
        totalCopies: parseInt(totalCopies),
        availableCopies: parseInt(totalCopies),
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
