"use client";
import { useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Calendar,
  AlertTriangle,
  BarChart,
  FileSpreadsheet,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";

type DataItem = {
  date: string;
  ingredient: string;
  consumption: number;
  type: "daily" | "monthly";
  high_risk: boolean;
};

export default function DemandPage() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DataItem[]>([]);
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("demand");

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
        setError("");
      }
    },
    []
  );

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", new Date().toISOString().split("T")[0]);
    if (season) formData.append("season", season);

    try {
      const response = await axios.post(
        "http://localhost:5001/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setData(response.data);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to upload file. Please try again."
      );
      console.error(
        "Error uploading file:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }, [file, season]);

  // Calculate summary stats
  const totalConsumption = data.reduce(
    (sum, item) => sum + item.consumption,
    0
  );
  const highRiskCount = data.filter((item) => item.high_risk).length;
  const uniqueIngredients = [...new Set(data.map((item) => item.ingredient))]
    .length;

  return (
    <div className="min-h-screen bg-black text-gray-200">
      <Navbar activePage={activePage} onPageChange={setActivePage} />

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Demand Analysis
          </h1>
          <p className="text-gray-400 mt-2">
            Upload your ingredient consumption data to analyze demand patterns
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Upload Data</CardTitle>
            <CardDescription>
              Upload your Excel file containing ingredient consumption data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    file
                      ? "border-purple-500 bg-purple-900/20"
                      : "border-gray-700 hover:border-purple-500/50 bg-gray-800/50 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    {file ? (
                      <>
                        <FileSpreadsheet className="h-8 w-8 text-purple-400 mb-1" />
                        <p className="text-gray-300 text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 px-2"
                          onClick={() => setFile(null)}
                        >
                          Remove file
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="rounded-full bg-purple-900/20 p-2 mb-2">
                          <Upload className="h-6 w-6 text-purple-400" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-gray-300 text-sm font-medium">
                            Drag and drop your Excel file here
                          </p>
                          <p className="text-xs text-gray-400">
                            or click to browse
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1">
                            Supports .xlsx, .xls files
                          </p>
                        </div>
                        <Input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="mt-2 cursor-pointer inline-flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
                        >
                          Choose File
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Select
                      value={season}
                      onValueChange={setSeason}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select season (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-800">
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="fall">Fall</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="bg-purple-600 hover:bg-purple-700 min-w-[120px]"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="text-red-400 text-sm flex items-center space-x-2 bg-red-900/20 p-3 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Ingredients
                </CardTitle>
                <FileSpreadsheet className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueIngredients}</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Consumption
                </CardTitle>
                <BarChart className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConsumption}</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  High Risk Items
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">
                  {highRiskCount}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Table */}
        {data.length > 0 && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Ingredient Consumption Data</CardTitle>
              <CardDescription>
                Detailed view of ingredient consumption patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-gray-800">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-800/50">
                      <TableHeaderCell className="text-gray-200 font-semibold">Date</TableHeaderCell>
                      <TableHeaderCell className="text-gray-200 font-semibold">Ingredient</TableHeaderCell>
                      <TableHeaderCell className="text-gray-200 font-semibold">Consumption</TableHeaderCell>
                      <TableHeaderCell className="text-gray-200 font-semibold">Type</TableHeaderCell>
                      <TableHeaderCell className="text-gray-200 font-semibold">Status</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-800/30">
                        <TableCell className="text-gray-200">{item.date}</TableCell>
                        <TableCell className="text-gray-200 font-medium">{item.ingredient}</TableCell>
                        <TableCell className="text-gray-200">{item.consumption}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.type === "daily" ? "default" : "secondary"
                            }
                            className="bg-purple-900/40 text-purple-300 hover:bg-purple-900/60"
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.high_risk ? (
                            <Badge
                              variant="destructive"
                              className="bg-red-900/40 text-red-300 hover:bg-red-900/60"
                            >
                              High Risk
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-900/40 text-green-300 hover:bg-green-900/60"
                            >
                              Normal
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 