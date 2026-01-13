import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            📚 Library Management System
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12">
            Complete full-stack application with REST APIs
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/books"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">📖</div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Books</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your library's book collection
              </p>
            </Link>

            <Link
              href="/members"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Members</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage library members
              </p>
            </Link>

            <Link
              href="/borrowings"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">🔄</div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-white">Borrowings</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track book checkouts and returns
              </p>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Features</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>✅ Complete CRUD operations for books, members, and borrowings</li>
              <li>✅ RESTful API endpoints</li>
              <li>✅ Track due dates and overdue books</li>
              <li>✅ Modern, responsive UI</li>
              <li>✅ Built with Next.js 14, TypeScript, Prisma, and SQLite</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
