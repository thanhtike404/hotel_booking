"use client";

import { Menu } from "lucide-react";

interface SidebarToggleProps {
  onToggle: () => void;
}

export function SidebarToggle({ onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-gray-700 lg:hidden"
    >
      <Menu className="h-6 w-6 text-white" />
    </button>
  );
}