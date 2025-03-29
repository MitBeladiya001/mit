"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  LineChart,
  PieChart,
  Settings,
  Menu,
  ChefHat,
} from "lucide-react";

interface NavbarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function Navbar({ activePage, onPageChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(!mobileMenuOpen);
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 backdrop-blur bg-opacity-90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                activePage === "home"
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => onPageChange("home")}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/demand"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                activePage === "demand"
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => onPageChange("demand")}
            >
              <LineChart className="h-5 w-5" />
              <span>Demand Analysis</span>
            </Link>
            <Link
              href="/menu-optimization"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                activePage === "menu"
                  ? "text-purple-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              onClick={() => onPageChange("menu")}
            >
              <ChefHat className="h-5 w-5" />
              <span>Menu Optimize</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/reports"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activePage === "reports"
                  ? "bg-purple-900/40 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => onPageChange("reports")}
            >
              <PieChart className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link
              href="/settings"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activePage === "settings"
                  ? "bg-purple-900/40 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              onClick={() => onPageChange("settings")}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md font-medium ${
                activePage === "home"
                  ? "text-white bg-purple-900/40"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => {
                onPageChange("home");
                setMobileMenuOpen(false);
              }}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/demand"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md font-medium ${
                activePage === "demand"
                  ? "text-white bg-purple-900/40"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => {
                onPageChange("demand");
                setMobileMenuOpen(false);
              }}
            >
              <LineChart className="h-4 w-4" />
              <span>Demand Analysis</span>
            </Link>
            <Link
              href="/menu-optimization"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md font-medium ${
                activePage === "menu"
                  ? "text-white bg-purple-900/40"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => {
                onPageChange("menu");
                setMobileMenuOpen(false);
              }}
            >
              <ChefHat className="h-4 w-4" />
              <span>Menu Optimize</span>
            </Link>
            <Link
              href="/reports"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md font-medium ${
                activePage === "reports"
                  ? "text-white bg-purple-900/40"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => {
                onPageChange("reports");
                setMobileMenuOpen(false);
              }}
            >
              <PieChart className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link
              href="/settings"
              className={`flex items-center space-x-3 px-3 py-2 rounded-md font-medium ${
                activePage === "settings"
                  ? "text-white bg-purple-900/40"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
              onClick={() => {
                onPageChange("settings");
                setMobileMenuOpen(false);
              }}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 