"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Dish } from "../types";

export function DishList() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get("http://localhost:5001/get-dishes");
      if (response.data.success) {
        const dishesWithCorrectUrls = response.data.dishes.map((dish: Dish) => ({
          ...dish,
          photo: dish.photo.startsWith('http') 
            ? dish.photo 
            : `http://localhost:5001${dish.photo}`
        }));
        setDishes(dishesWithCorrectUrls);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">All Dishes</h2>
        <Link href="/menu-optimization/CreateDishPage">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Dish
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <div
              key={dish._id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-purple-500 transition-colors"
            >
              <img
                src={dish.photo}
                alt={dish.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{dish.name}</h3>
                <p className="text-purple-400 mb-4">${dish.price?.toFixed(2) || '0.00'}</p>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded text-sm"
                    >
                      {ingredient.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
