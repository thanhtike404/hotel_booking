"use client";
import Navbar from "@/components/Navbar";
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Site Header */}


      {/* Site Content */}
      <Navbar />
      <main className="flex-1">

        {children}</main>

      {/* Site Footer */}
      <footer className="">
        <div className="container mx-auto px-4 py-8">
          {/* Add your footer content here */}
        </div>
      </footer>
    </div>
  );
}