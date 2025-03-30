"use client";
import { AIDish } from "../menu-optimization/components/ai-dish";
import { Navbar } from "@/components/navbar";

export default function AIDishPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navbar activePage="ai-dishes" onPageChange={() => {}} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            AI Dish Generator
          </h1>
          <p className="text-gray-400 mt-2">
            Generate creative and unique dishes using artificial intelligence
          </p>
        </div>
        <AIDish />
      </div>
    </div>
  );
} 