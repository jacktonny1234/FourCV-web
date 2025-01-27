"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const modelCards = {
  "yolov5-object-detection": {
    title: "YOLOv5 Object Detection",
    description: "State-of-the-art object detection model with real-time performance and high accuracy.",
    modelType: ["YOLOv5", "Real-time"],
    category: "Object Detection"
  },
  "resnet50-classification": {
    title: "ResNet50 Image Classification",
    description: "Deep residual learning framework for image classification.",
    modelType: ["ResNet50", "CNN"],
    category: "Image Recognition"
  },
  "facenet-recognition": {
    title: "FaceNet Recognition System",
    description: "Advanced facial recognition model using deep convolutional networks.",
    modelType: ["FaceNet", "Deep Learning"],
    category: "Facial Recognition"
  },
  "maskrcnn-segmentation": {
    title: "Mask R-CNN Segmentation",
    description: "Instance segmentation model for object detection and segmentation masks.",
    modelType: ["Mask R-CNN", "Instance Segmentation"],
    category: "Object Detection"
  },
  "efficientnet-classification": {
    title: "EfficientNet Classification",
    description: "Scalable and efficient model for image classification.",
    modelType: ["EfficientNet", "Mobile"],
    category: "Image Recognition"
  },
  "detr-detection": {
    title: "DETR Object Detection",
    description: "End-to-End Object Detection with Transformers.",
    modelType: ["DETR", "Transformer"],
    category: "Object Detection"
  }
};

export default function TestModel({ params }: { params: { modelId: string } }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const model = modelCards[params.modelId as keyof typeof modelCards];

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Model not found</h1>
          <Button asChild>
            <Link href="/introduce">Back to Models</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setResult(null);

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulated results based on model type
      let simulatedResult = "";
      switch (model.category) {
        case "Object Detection":
          simulatedResult = "Detected Objects:\n• Person (99%)\n• Car (95%)\n• Traffic Light (87%)";
          break;
        case "Image Recognition":
          simulatedResult = "Classification Results:\n• Street Scene (98%)\n• Urban Environment (95%)\n• City (92%)";
          break;
        case "Facial Recognition":
          simulatedResult = "Face Analysis:\n• Age: 25-35\n• Gender: Male\n• Expression: Neutral\n• Looking at Camera: Yes";
          break;
      }
      
      setResult(simulatedResult);
    } catch (error) {
      alert("Error processing image");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">FourCV</span>
            </div>
            <Button asChild variant="ghost">
              <Link href="/introduce">Back to Models</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{model.title}</h1>
              <p className="text-gray-600 mb-4">{model.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-600">{model.category}</Badge>
                {model.modelType.map((type, index) => (
                  <Badge key={index} variant="secondary">{type}</Badge>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {selectedImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer text-center"
                  >
                    <div className="text-gray-600 mb-2">
                      Click to upload an image
                    </div>
                    <Button variant="secondary">Choose File</Button>
                  </label>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!selectedImage || isProcessing}
                onClick={handleProcess}
              >
                {isProcessing ? "Processing..." : "Analyze Image"}
              </Button>

              {result && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Results:</h4>
                  <pre className="text-sm text-gray-700 whitespace-pre-line">{result}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}