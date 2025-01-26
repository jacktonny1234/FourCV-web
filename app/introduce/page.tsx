"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Brain } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Introduce() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const resetState = () => {
    setSelectedImage(null);
    setSelectedModel("");
    setResult(null);
    setIsProcessing(false);
  };

  const processImage = async (type: 'recognition' | 'detection' | 'facial') => {
    if (!selectedImage || !selectedModel) {
      alert("Please select both an image and a model");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // Simulated API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (type) {
        case 'recognition':
          setResult("Image Recognition Results:\n• Person (99%)\n• Chair (85%)\n• Laptop (92%)");
          break;
        case 'detection':
          setResult("Object Detection Results:\n• Car at (150, 200): 95% confidence\n• Traffic Light at (300, 100): 88% confidence\n• Pedestrian at (400, 300): 92% confidence");
          break;
        case 'facial':
          setResult("Facial Analysis Results:\n• Age Range: 25-35\n• Expression: Smiling (98%)\n• Glasses: Yes (95%)\n• Looking at Camera: Yes (99%)");
          break;
      }
    } catch (error) {
      alert("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderTestingDialog = (type: 'recognition' | 'detection' | 'facial') => {
    const titles = {
      recognition: "Test Image Recognition",
      detection: "Test Object Detection",
      facial: "Test Facial Recognition"
    };

    const models = {
      recognition: [
        { value: "general", label: "General Object Detection" },
        { value: "scene", label: "Scene Recognition" },
        { value: "text", label: "Text Recognition (OCR)" },
        { value: "custom", label: "Custom Model" }
      ],
      detection: [
        { value: "realtime", label: "Real-time Detection" },
        { value: "precision", label: "High Precision" },
        { value: "speed", label: "High Speed" },
        { value: "custom", label: "Custom Model" }
      ],
      facial: [
        { value: "basic", label: "Basic Face Detection" },
        { value: "advanced", label: "Advanced Analysis" },
        { value: "emotion", label: "Emotion Recognition" },
        { value: "custom", label: "Custom Model" }
      ]
    };

    return (
      <DialogContent className="sm:max-w-[600px]" onInteractOutside={resetState} onEscapeKeyDown={resetState}>
        <DialogHeader>
          <DialogTitle>{titles[type]}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
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
                    id={`image-upload-${type}`}
                  />
                  <label
                    htmlFor={`image-upload-${type}`}
                    className="cursor-pointer text-center"
                  >
                    <div className="text-gray-600 mb-2">
                      Click to upload an image
                    </div>
                    <Button variant="secondary">Choose File</Button>
                  </label>
                </div>
              )}

              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {models[type].map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={() => processImage(type)}
                disabled={!selectedImage || !selectedModel || isProcessing}
                className="w-full"
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
      </DialogContent>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold">FourCV</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
              <Link href="/introduce" className="text-gray-700 hover:text-indigo-600">About Us</Link>
              <Link href="#" className="text-gray-700 hover:text-indigo-600">Services</Link>
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

      {/* Services Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Innovative Computer Vision Solutions</h2>
          <p className="text-indigo-600 text-center mb-12">Transforming data into actionable insights</p>

          <div className="grid md:grid-cols-3 gap-8">
            <Dialog onOpenChange={() => resetState()}>
              <DialogTrigger asChild>
                <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105">
                  <img
                    src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Image Recognition"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Image Recognition</h3>
                  <p className="text-gray-600 mb-4">
                    Our image recognition technology enables businesses to process and analyze visual data with unparalleled accuracy.
                  </p>
                  <Button variant="outline" className="w-full">Test Now</Button>
                </div>
              </DialogTrigger>
              {renderTestingDialog('recognition')}
            </Dialog>

            <Dialog onOpenChange={() => resetState()}>
              <DialogTrigger asChild>
                <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105">
                  <img
                    src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Object Detection"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Object Detection</h3>
                  <p className="text-gray-600 mb-4">
                    Advanced object detection services that empower clients to identify and classify objects within images and videos in real-time.
                  </p>
                  <Button variant="outline" className="w-full">Test Now</Button>
                </div>
              </DialogTrigger>
              {renderTestingDialog('detection')}
            </Dialog>

            <Dialog onOpenChange={() => resetState()}>
              <DialogTrigger asChild>
                <div className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105">
                  <img
                    src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Facial Recognition"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">Facial Recognition</h3>
                  <p className="text-gray-600 mb-4">
                    State-of-the-art facial recognition technology for enhanced security and seamless authentication solutions.
                  </p>
                  <Button variant="outline" className="w-full">Test Now</Button>
                </div>
              </DialogTrigger>
              {renderTestingDialog('facial')}
            </Dialog>
          </div>
        </div>
      </section>

      {/* Expert Consulting Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Expert Consulting Services</h2>
          <p className="text-indigo-600 text-center mb-12">Guiding You Towards Success</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Strategic Planning"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Strategic Planning</h3>
              <p className="text-gray-600">
                Tailored strategic planning services to help businesses identify opportunities for implementing computer vision solutions effectively.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Implementation Support"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Implementation Support</h3>
              <p className="text-gray-600">
                Comprehensive support during the implementation phase, ensuring projects are executed smoothly and efficiently.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Performance Evaluation"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Performance Evaluation</h3>
              <p className="text-gray-600">
                Thorough performance evaluations post-implementation, helping clients optimize their systems and achieve desired outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Transparent Pricing Plans</h2>
          <p className="text-gray-400 text-center mb-12">Choose the right plan for your needs</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Basic Plan</h3>
              <p className="text-3xl font-bold mb-6">$99<span className="text-lg">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li>• Basic image recognition</li>
                <li>• Standard support</li>
                <li>• Monthly performance reports</li>
              </ul>
              <Button className="w-full">Select Plan</Button>
            </div>

            <div className="bg-indigo-600 p-8 rounded-lg relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-sm px-3 py-1 rounded-bl-lg rounded-tr-lg">
                Recommended
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional Plan</h3>
              <p className="text-3xl font-bold mb-6">$199<span className="text-lg">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li>• Advanced object detection</li>
                <li>• Priority support</li>
                <li>• Bi-weekly performance analytics</li>
              </ul>
              <Button className="w-full bg-white text-indigo-600 hover:bg-gray-100">Select Plan</Button>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Enterprise Plan</h3>
              <p className="text-3xl font-bold mb-6">$499<span className="text-lg">/mo</span></p>
              <ul className="space-y-3 mb-8">
                <li>• Comprehensive facial recognition</li>
                <li>• Dedicated account manager</li>
                <li>• Custom solutions development</li>
              </ul>
              <Button className="w-full">Select Plan</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}