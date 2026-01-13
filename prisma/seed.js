const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.borrowing.deleteMany();
  await prisma.book.deleteMany();
  await prisma.member.deleteMany();

  // Create books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "978-0-7432-7356-5",
        publicationYear: 1925,
        totalCopies: 5,
        availableCopies: 5,
      },
    }),
    prisma.book.create({
      data: {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        isbn: "978-0-06-112008-4",
        publicationYear: 1960,
        totalCopies: 3,
        availableCopies: 3,
      },
    }),
    prisma.book.create({
      data: {
        title: "1984",
        author: "George Orwell",
        isbn: "978-0-452-28423-4",
        publicationYear: 1949,
        totalCopies: 4,
        availableCopies: 4,
      },
    }),
    prisma.book.create({
      data: {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        isbn: "978-0-14-143951-8",
        publicationYear: 1813,
        totalCopies: 3,
        availableCopies: 3,
      },
    }),
    prisma.book.create({
      data: {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        isbn: "978-0-316-76948-0",
        publicationYear: 1951,
        totalCopies: 2,
        availableCopies: 2,
      },
    }),
  ]);

  // Create members
  const members = await Promise.all([
    prisma.member.create({
      data: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1-555-0101",
        address: "123 Main St, New York, NY 10001",
      },
    }),
    prisma.member.create({
      data: {
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1-555-0102",
        address: "456 Oak Ave, Los Angeles, CA 90001",
      },
    }),
    prisma.member.create({
      data: {
        name: "Bob Johnson",
        email: "bob.johnson@email.com",
        phone: "+1-555-0103",
        address: "789 Pine Rd, Chicago, IL 60601",
      },
    }),
  ]);

  console.log('Database seeded successfully!');
  console.log('Created books:', books.length);
  console.log('Created members:', members.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
