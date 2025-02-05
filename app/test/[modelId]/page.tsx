'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import $ from "@/lib/axios"
import { useEffect, useRef } from "react";
import * as React from 'react'
import { processImageWithLuxandFaceFeatures, processImageWithYOLO } from "@/lib/opencv-utils"

export default function TestModel({ params }: { params: Promise<{ modelId: string }> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);
  const [canvasVisiblility, setCanvasVisiblity] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
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


  const handleProcess = () => {

    setIsProcessing(true);

    let i = new Image();
    i.src = selectedImage;
    i.onload = function(){
      let img_ratio = i.width / i.height;

      let size_ratio = 1;
      if (imgRef.current) {
        size_ratio = imgRef.current.height / i.height
      }
      setResult(null);
  
      try {
        // let test: any = {'detections': [{'boxes': {'xyxy': [[10.8536376953125, 57.14820861816406, 317.79779052734375, 471.7489013671875], [338.3193359375, 24.6817626953125, 638.53759765625, 373.11419677734375], [40.029144287109375, 73.490234375, 175.7930908203125, 118.41522216796875], [5.7230224609375, 1.066986083984375, 636.361572265625, 476.1783752441406]], 'conf': [0.9053866863250732, 0.8976907730102539, 0.752298891544342, 0.4879526197910309], 'cls': [15.0, 15.0, 65.0, 57.0]}, 'masks': null, 'keypoints': null, 'probs': null, 'obb': null}], 'names': {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane', 5: 'bus', 6: 'train', 7: 'truck', 8: 'boat', 9: 'traffic light', 10: 'fire hydrant', 11: 'stop sign', 12: 'parking meter', 13: 'bench', 14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear', 22: 'zebra', 23: 'giraffe', 24: 'backpack', 25: 'umbrella', 26: 'handbag', 27: 'tie', 28: 'suitcase', 29: 'frisbee', 30: 'skis', 31: 'snowboard', 32: 'sports ball', 33: 'kite', 34: 'baseball bat', 35: 'baseball glove', 36: 'skateboard', 37: 'surfboard', 38: 'tennis racket', 39: 'bottle', 40: 'wine glass', 41: 'cup', 42: 'fork', 43: 'knife', 44: 'spoon', 45: 'bowl', 46: 'banana', 47: 'apple', 48: 'sandwich', 49: 'orange', 50: 'broccoli', 51: 'carrot', 52: 'hot dog', 53: 'pizza', 54: 'donut', 55: 'cake', 56: 'chair', 57: 'couch', 58: 'potted plant', 59: 'bed', 60: 'dining table', 61: 'toilet', 62: 'tv', 63: 'laptop', 64: 'mouse', 65: 'remote', 66: 'keyboard', 67: 'cell phone', 68: 'microwave', 69: 'oven', 70: 'toaster', 71: 'sink', 72: 'refrigerator', 73: 'book', 74: 'clock', 75: 'vase', 76:           'scissors', 77: 'teddy bear', 78: 'hair drier', 79: 'toothbrush'}}
        // if (imgRef.current) {
        //   processImageWithYOLO("yolo11n.pt", imgRef.current, test, img_ratio, size_ratio);
        //   setResult(JSON.stringify(test));
        // }
        if(model.key.indexOf("cls") < 0)
          setCanvasVisiblity(true);

        if( model.tags.indexOf("YOLO") > -1 ){
          $.post("yolo/", 
            {
              model: model.key,
              data: selectedImage,
              param:{}
            },
           (response: any)=>{

            if (imgRef.current) {
              processImageWithYOLO(model.key, imgRef.current, response.data, img_ratio, size_ratio);
              setResult(JSON.stringify(response.data));
            }
          setIsProcessing(false);
          }, (e: any)=>{
            setIsProcessing(false);
            alert("Error processing image");
          });
        }else if( model.tags.indexOf("Face") > -1){
          if(model.key == "facialfeatures")
            setCanvasVisiblity(true);
          $.post("face/" + model.key, 
            {
              data: selectedImage,
            },
           (response: any)=>{
            if(model.key == "facialfeatures"){
              setCanvasVisiblity(true);
              if (imgRef.current) {
                processImageWithLuxandFaceFeatures(imgRef.current, response.data, img_ratio, size_ratio);
              } else {
                console.error("Canvas reference is null");
              }
            }
            setIsProcessing(false);
            setResult(JSON.stringify(response.data));
          }, (e: any)=>{
            setIsProcessing(false);
            alert("Error processing image");
          });
        }else{
          $.post("hugging/" + model.key, 
            {
              data: selectedImage,
            },
           (response: any)=>{
            if(model.key == "ImageSegmentation"){
              setCanvasVisiblity(false);
              let data = "data:image/png;base64," + response.data.data;
              if (imgRef.current) {
                setSelectedImage(data);
              } else {
                console.error("Canvas reference is null");
              }
            }
            setIsProcessing(false);
            setResult(JSON.stringify(response.data));
          }, (e: any)=>{
            setIsProcessing(false);
            alert("Error processing image");
          });
        }
      } catch (error) {
        alert("Error processing image");
      } finally {
      }
    };
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
              { canvasVisiblility && 
              <div ref={wrapRef} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 flex justify-center">
                <canvas id="outputCanvas" ref={canvasRef}></canvas>
                </div>
              }
              {result && (
                <div>
                  <div className="p-4 bg-gray-50 rounded-lg break-all">
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