"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ModelCard {
  id: string;
  title: string;
  description: string;
  image: string;
  modelType: string[];
  category: string;
  accuracy: string;
  speed: string;
}

const modelCards: ModelCard[] = [
  {
    id: "yolov5-object-detection",
    title: "YOLOv5 Object Detection",
    description: "State-of-the-art object detection model with real-time performance and high accuracy. Perfect for real-world applications.",
    image: "https://images.unsplash.com/photo-1527430253228-e93688616381?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    modelType: ["YOLOv5", "Real-time"],
    category: "Object Detection",
    accuracy: "93.5%",
    speed: "45 FPS"
  },
  {
    id: "resnet50-classification",
    title: "ResNet50 Image Classification",
    description: "Deep residual learning framework for image classification with exceptional feature extraction capabilities.",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    modelType: ["ResNet50", "CNN"],
    category: "Image Recognition",
    accuracy: "95.2%",
    speed: "60 FPS"
  },
  {
    id: "facenet-recognition",
    title: "FaceNet Recognition System",
    description: "Advanced facial recognition model using deep convolutional networks for accurate face detection and recognition.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    modelType: ["FaceNet", "Deep Learning"],
    category: "Facial Recognition",
    accuracy: "99.1%",
    speed: "30 FPS"
  },
  {
    id: "maskrcnn-segmentation",
    title: "Mask R-CNN Segmentation",
    description: "Instance segmentation model that excels at detecting objects while simultaneously generating high-quality segmentation masks.",
    image: "https://images.unsplash.com/photo-1576400883215-7083980b6193?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    modelType: ["Mask R-CNN", "Instance Segmentation"],
    category: "Object Detection",
    accuracy: "91.8%",
    speed: "15 FPS"
  },
  {
    id: "efficientnet-classification",
    title: "EfficientNet Classification",
    description: "Scalable and efficient model that achieves both better accuracy and better efficiency than previous ConvNets.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    modelType: ["EfficientNet", "Mobile"],
    category: "Image Recognition",
    accuracy: "97.1%",
    speed: "75 FPS"
  },
  {
    id: "detr-detection",
    title: "DETR Object Detection",
    description: "End-to-End Object Detection with Transformers, providing a new approach to object detection using transformer architecture.",
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    modelType: ["DETR", "Transformer"],
    category: "Object Detection",
    accuracy: "94.7%",
    speed: "25 FPS"
  }
];

export default function Introduce() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const router = useRouter();

  const filteredModels = modelCards.filter(model => {
    const matchesSearch = 
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.modelType.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || model.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const handleModelClick = (modelId: string) => {
    router.push(`/test/${modelId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">FourCV</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link href="/introduce" className="text-gray-700 hover:text-indigo-600">Services</Link>
              <Button asChild>
                <Link href="/report">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

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
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Image Recognition">Image Recognition</SelectItem>
                  <SelectItem value="Object Detection">Object Detection</SelectItem>
                  <SelectItem value="Facial Recognition">Facial Recognition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredModels.map((model) => (
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
                  <p className="text-gray-600 mb-4">{model.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {model.modelType.map((type, index) => (
                      <Badge key={index} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Accuracy: {model.accuracy}</span>
                    <span>Speed: {model.speed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}