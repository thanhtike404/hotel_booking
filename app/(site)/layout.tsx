export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Site Header */}
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-6">
          {/* Add your site navigation items here */}
        </nav>
      </header>

      {/* Site Content */}
      <main className="flex-1">{children}</main>

      {/* Site Footer */}
      <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Add your footer content here */}
        </div>
      </footer>
    </div>
  );
}