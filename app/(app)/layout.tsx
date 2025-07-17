"use client";
import Navbar from "@/components/Navbar";
import { WebSocketProvider } from "@/providers/webSocketProvider";
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
   
   
  
      // Handle any potential errors in the WebSocket connection

  
  return (
  
    <div className="min-h-screen flex flex-col">
    
      <Navbar />
      <main className="flex-1 py-8">

        {children}</main>

      <footer className="">
        <div className="container mx-auto px-4 py-8">
          {/* Add your footer content here */}
        </div>
      </footer>
    </div>

  );
}