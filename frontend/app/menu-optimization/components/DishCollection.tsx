import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Dish {
  _id?: string;
  name: string;
  photo: string;
  price: number;
  ingredients: Ingredient[];
}

interface DishCollectionProps {
  dishes: Dish[];
  isLoading: boolean;
}

export function DishCollection({ dishes, isLoading }: DishCollectionProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardContent className="p-6 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400 mb-2" />
            <p className="text-gray-400">Loading dishes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dishes.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardContent className="p-6 flex justify-center items-center">
          <p className="text-gray-400">No dishes added yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-900 to-purple-900">
        <CardTitle className="text-xl text-white">Your Dish Collection</CardTitle>
        <CardDescription className="text-gray-200">
          Showcasing your culinary masterpieces
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish) => (
            <Card
              key={dish._id}
              className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={dish.photo}
                  alt={dish.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 right-0 m-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ${dish.price.toFixed(2)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-100">
                  {dish.name}
                </h3>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">
                    Ingredients:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ingredient, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs bg-purple-900/40 text-purple-200 rounded-full"
                      >
                        {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 