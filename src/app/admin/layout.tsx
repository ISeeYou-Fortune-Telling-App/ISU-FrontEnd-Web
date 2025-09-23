export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="#" className="block p-2 rounded hover:bg-gray-700">Dashboard</a>
          <a href="#" className="block p-2 rounded hover:bg-gray-700">Users</a>
          <a href="#" className="block p-2 rounded hover:bg-gray-700">Movies</a>
          <a href="#" className="block p-2 rounded hover:bg-gray-700">Settings</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
