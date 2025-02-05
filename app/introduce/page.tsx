"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/layout/nav-bar";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

interface ModelCard {
  id: number;
  title: string;
  desc: string;
  image: string;
  tags: string[];
  category: string;
}

export default function Introduce() {
  const [modelCards, setModelCards] = useState<ModelCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagsFilter, setTagsFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchModelCards = async () => {
      try {
      const response = await fetch(`/api/models?searchQuery=${searchQuery}&tagsFilter=${tagsFilter}&categoryFilter=${categoryFilter}&currentPage=${currentPage}`);
      const data = await response.json();

      if (response.ok) {
        setModelCards(data.data);
        setTotalPages(data.totalPages);
      } else {
        console.error(data.error);
      }
      } catch (error) {
      console.error('Failed to fetch model cards:', error);
      }
    };

    fetchModelCards();
  }, [searchQuery, tagsFilter, categoryFilter, currentPage]);

  const handleModelClick = (modelId: number) => {
    router.push(`/test/${modelId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Comprehensive Services
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Empowering Vision Through Innovation
            </p>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">AI Model Gallery</h2>
          <p className="text-indigo-600 text-center mb-6">Explore our cutting-edge computer vision models</p>

          {/* Search Form */}
          <div className="relative max-w-3xl mx-auto mb-12">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select
                value={tagsFilter}
                onValueChange={setTagsFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Type</SelectItem>
                  <SelectItem value="YOLO">YOLO</SelectItem>
                  <SelectItem value="Hugging Face">Hugging Face</SelectItem>
                  <SelectItem value="Face">Face</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Object Segmentation">Object Segmentation</SelectItem>
                  <SelectItem value="Object Detection">Object Detection</SelectItem>
                  <SelectItem value="Object Classify">Object Classify</SelectItem>
                  <SelectItem value="Pose">Pose</SelectItem>
                  <SelectItem value="OBB">OBB</SelectItem>
                  <SelectItem value="Image Feature Extraction">Image Feature Extraction</SelectItem>
                  <SelectItem value="Image to Text">Image to Text</SelectItem>
                  <SelectItem value="Face Feature Detection">Face Feature Detection</SelectItem>
                  <SelectItem value="Gender Recognition">Age Detection</SelectItem>
                  <SelectItem value="Express Detection">Gender Detection</SelectItem>
                  <SelectItem value="Express Detection">Express Detection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modelCards.map((model) => (
              <div
                key={model.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleModelClick(model.id)}
              >
                <div className="relative h-48">
                  <img
                    src={model.image}
                    alt={model.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-indigo-600">{model.category}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{model.title}</h3>
                  <p className="text-gray-600 mb-4">{model.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.tags.map((type, index) => (
                      <Badge key={index} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                variant={currentPage === index + 1 ? "default" : "secondary"}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
