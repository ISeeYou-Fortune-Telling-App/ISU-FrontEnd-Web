// src/app/admin/page.tsx
export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="#" className="block p-2 rounded hover:bg-gray-700">
            Dashboard
          </a>
          <a href="#" className="block p-2 rounded hover:bg-gray-700">
            Users
          </a>
          <a href="#" className="block p-2 rounded hover:bg-gray-700">
            Movies
          </a>
          <a href="#" className="block p-2 rounded hover:bg-gray-700">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold">Welcome, Admin 👋</h1>
        <p className="mt-4 text-gray-600">This is your admin dashboard.</p>
      </main>
    </div>
  );
}
