"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Home, LineChart, ChefHat } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function HomePage() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navbar activePage={activePage} onPageChange={setActivePage} />

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Kitchen Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome to your kitchen management system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ingredients
              </CardTitle>
              <Home className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Consumption
              </CardTitle>
              <LineChart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Demand Analysis</CardTitle>
              <CardDescription>
                Analyze ingredient consumption patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/demand">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <LineChart className="mr-2 h-4 w-4" />
                  View Demand Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Menu Optimization</CardTitle>
              <CardDescription>
                Optimize your menu with AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/menu-optimization">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Optimize Menu
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
