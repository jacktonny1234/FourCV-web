'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import $ from "@/lib/axios"
import { useEffect, useRef } from "react";
import * as React from 'react'
import { processImageWithLuxandFaceFeatures } from "@/lib/opencv-utils"

export default function TestModel({ params }: { params: Promise<{ modelId: string }> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const { modelId } = React.use(params)

  useEffect(() => {
    if (!modelId) return;

    const fetchModelCard = async (modelId: string) => {
      try {
        const response = await fetch(`/api/models?modelId=${modelId}`);
        const data = await response.json();
      
        if (response.ok) {
          setModel(data.data[0]);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch model cards:', error);
      }
    };

    fetchModelCard(modelId);

  }, []);

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

      $.post({data:selectedImage}, (response: any)=>{
        console.log(response);
        if (imgRef.current) {
          debugger;
          processImageWithLuxandFaceFeatures(imgRef.current, response.data);
        } else {
          console.error("Canvas reference is null");
        }
      });
      
      // let test = {x:334, y:215, w:234, padding:0, angle:4.992159, features:[[ 280, 220], [ 356, 216], [ 295, 269], [ 279, 292], [ 354, 296], [ 263, 314], [ 412, 318], [ 274, 334], [ 389, 339], [ 290, 351], [ 353, 355], [ 313, 360], [ 251, 201], [ 273, 201], [ 331, 195], [ 378, 197], [ 263, 196], [ 354, 190], [ 257, 198], [ 268, 199], [ 341, 190], [ 366, 193], [ 302, 216], [ 258, 222], [ 291, 223], [ 335, 221], [ 374, 216], [ 274, 227], [ 275, 215], [ 272, 220], [ 288, 222], [ 355, 222], [ 353, 211], [ 348, 218], [ 364, 216], [ 265, 218], [ 285, 218], [ 266, 225], [ 282, 226], [ 343, 215], [ 364, 212], [ 345, 222], [ 365, 219], [ 285, 257], [ 322, 253], [ 279, 267], [ 333, 261], [ 286, 270], [ 316, 270], [ 300, 280], [ 274, 277], [ 351, 274], [ 269, 289], [ 366, 290], [ 306, 289], [ 309, 314], [ 292, 289], [ 331, 290], [ 290, 308], [ 333, 310], [ 292, 293], [ 307, 294], [ 331, 294], [ 290, 303], [ 307, 307], [ 332, 304], [ 245, 243], [ 440, 237], [ 251, 283], [ 433, 282]]}


      
      // Simulated results based on model type
      // setResult(simulatedResult);
      
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
              <p className="text-gray-600 mb-4">{model.desc}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-600">{model.category}</Badge>
                {model.tags.map((type :any, index :any) => (
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
                    ref={imgRef} 
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
              <canvas id="outputCanvas"></canvas>

              {result && (
                <div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Results:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line">{result}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}