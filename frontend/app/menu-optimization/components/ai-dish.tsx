"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Sparkles,
  ChefHat,
  DollarSign,
  Package,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

interface AIDish {
  name: string;
  description: string;
  ingredients: string[];
  cost: number;
  profit_margin: number;
  special_occasion: boolean;
}

interface CustomIngredient {
  name: string;
  quantity: number;
  completed: boolean;
}

export function AIDish() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedDishes, setGeneratedDishes] = useState<AIDish[]>([]);
  const [message, setMessage] = useState("");
  const [showCustomIngredients, setShowCustomIngredients] = useState(false);
  const [customIngredients, setCustomIngredients] = useState<
    CustomIngredient[]
  >([{ name: "", quantity: 0, completed: false }]);

  const generateFromInventory = async () => {
    setLoading(true);
    setError("");
    setShowCustomIngredients(false);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5001/generate-dishes",
        {
          type: "inventory",
        }
      );

      if (response.data.success) {
        setGeneratedDishes(response.data.dishes);
      } else {
        setError(response.data.message || "Failed to generate dishes");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          setError(
            "Could not connect to the server. Please make sure the Flask server is running on port 5001."
          );
        } else if (error.response) {
          setError(
            error.response.data.message ||
              "Server error occurred. Please try again."
          );
        } else {
          setError(
            "Network error occurred. Please check your connection and try again."
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateFromCustomIngredients = async () => {
    // Validate ingredients
    const validIngredients = customIngredients.filter(
      (ing) => ing.name.trim() && ing.quantity > 0
    );

    if (validIngredients.length === 0) {
      setError("Please add at least one ingredient with name and quantity");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5001/generate-dishes",
        {
          type: "custom",
          ingredients: validIngredients.map((ing) => ({
            name: ing.name,
            quantity: ing.quantity,
          })),
          message: message.trim(),
        }
      );

      if (response.data.success) {
        setGeneratedDishes(response.data.dishes);
      } else {
        setError(response.data.message || "Failed to generate dishes");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNREFUSED") {
          setError(
            "Could not connect to the server. Please make sure the Flask server is running on port 5001."
          );
        } else if (error.response) {
          setError(
            error.response.data.message ||
              "Server error occurred. Please try again."
          );
        } else {
          setError(
            "Network error occurred. Please check your connection and try again."
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    setCustomIngredients([
      ...customIngredients,
      { name: "", quantity: 0, completed: false },
    ]);
  };

  const removeIngredient = (index: number) => {
    setCustomIngredients(customIngredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof CustomIngredient,
    value: string | number | boolean
  ) => {
    const newIngredients = [...customIngredients];
    if (field === "quantity") {
      const numValue = parseInt(value as string) || 0;
      newIngredients[index] = { ...newIngredients[index], [field]: numValue };
    } else {
      newIngredients[index] = { ...newIngredients[index], [field]: value };
    }
    setCustomIngredients(newIngredients);
  };

  const toggleIngredientComplete = (index: number) => {
    updateIngredient(index, "completed", !customIngredients[index].completed);
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>AI Dish Generator</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Generate creative dishes using AI based on available inventory or
            custom ingredients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={generateFromInventory}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    Generate from Inventory
                  </div>
                )}
              </Button>
              <Button
                onClick={() => setShowCustomIngredients(!showCustomIngredients)}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {showCustomIngredients
                    ? "Hide Custom Ingredients"
                    : "Generate from Custom Ingredients"}
                </div>
              </Button>
            </div>

            {showCustomIngredients && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">
                    Custom Ingredients
                  </label>
                  <div className="space-y-2">
                    {customIngredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleIngredientComplete(index)}
                          className={`${
                            ingredient.completed
                              ? "text-green-400"
                              : "text-gray-400"
                          } hover:text-green-400`}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Ingredient name"
                          value={ingredient.name}
                          onChange={(e) =>
                            updateIngredient(index, "name", e.target.value)
                          }
                          className="flex-1 bg-gray-800 border-gray-700"
                        />
                        <Input
                          type="number"
                          min="0"
                          placeholder="Quantity"
                          value={ingredient.quantity || ""}
                          onChange={(e) =>
                            updateIngredient(index, "quantity", e.target.value)
                          }
                          className="w-24 bg-gray-800 border-gray-700"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addIngredient}
                      className="w-full bg-gray-800 border-gray-700 hover:bg-gray-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Ingredient
                    </Button>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">
                        Custom Message (Optional)
                      </label>
                      <Textarea
                        placeholder="Add any specific requirements or preferences (e.g., vegetarian, spicy, etc.)"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-gray-800 border-gray-700 h-20"
                      />
                    </div>
                    <Button
                      onClick={generateFromCustomIngredients}
                      disabled={loading || customIngredients.length === 0}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Dishes
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {generatedDishes.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Generated Dishes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedDishes.map((dish, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ChefHat className="h-5 w-5 text-purple-400" />
                    <span>{dish.name}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {dish.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ingredient, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-purple-900/40 text-purple-300"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-gray-400">
                        Cost: ${dish.cost.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-green-400">
                      Profit: {dish.profit_margin}%
                    </span>
                  </div>
                  {dish.special_occasion && (
                    <Badge className="bg-yellow-900/40 text-yellow-300">
                      Special Occasion
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
