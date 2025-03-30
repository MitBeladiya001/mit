"use client";
import { AIDish } from "../menu-optimization/components/ai-dish";
import { Navbar } from "@/components/navbar";

export default function AIDishPage() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navbar activePage="ai-dishes" onPageChange={() => {}} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <AIDish />
      </div>
    </div>
  );
} 