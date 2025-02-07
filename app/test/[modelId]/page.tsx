'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import $ from "@/lib/axios"
import { useEffect, useRef } from "react";
import * as React from 'react'
import { processImageWithLuxandFaceFeatures, processImageWithYOLO, showImage} from "@/lib/opencv-utils"

export default function TestModel({ params }: { params: Promise<{ modelId: string }> }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [model, setModel] = useState<any>(null);
  const [canvasVisiblility, setCanvasVisiblity] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
    
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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


  useEffect(()=>{
    videoRef.current?.load();
  },[videoSource])

  if (!model) {
    return (<div></div>)
  }

  const handleVideoUpload =  (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoFile(e.target.files?.[0] || null)
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
    if (selectedImage) {
      i.src = selectedImage;
    } else {
      alert("No image selected");
      setIsProcessing(false);
      return;
    }
    i.onload = function(){
      let img_ratio = i.width / i.height;

      let size_ratio = 1;
      if (imgRef.current) {
        size_ratio = imgRef.current.height / i.height
      }
      setResult(null);
  
      try {
        if( model.tags.indexOf("YOLO") > -1 ){
          if(model.key.indexOf("cls") < 0)
            setCanvasVisiblity(true);

          $.post("yolo/", 
            {
              model: model.key,
              data: selectedImage,
              param:{}
            },
           (response: any)=>{

            if (imgRef.current) {
              processImageWithYOLO(model.key, imgRef.current, response.data, img_ratio, size_ratio);

              if(model.key.indexOf("cls") > 0){
                let data = response.data.detections[0].probs;
                let name = response.data.names;
                
                let result: { top1: string; top5: string[] } = {
                  top1: name[data.top1],
                  top5: []
                };

                for(let id of data.top5){
                  result.top5.push(name[id]);
                }

                setResult(JSON.stringify(result));
              }else{
                setResult(JSON.stringify(response.data));
              }
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
          if( model.key == "DepthEstimation" || model.key == "ImageSegmentation")
            setCanvasVisiblity(true);

          $.post("hugging/" + model.key, 
            {
              data: selectedImage,
            },
           (response: any)=>{
            setIsProcessing(false);
            if( model.key == "DepthEstimation" || model.key == "ImageSegmentation"){
              let data = "data:image/png;base64," + response.data.data

              let img = new Image();
              img.onload = () => {
                  showImage(img, img_ratio, size_ratio);
              };
              img.src = data;

            }else{
              setResult(JSON.stringify(response.data));
            }
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
  let i = true;

  const handleVideoProcess = () => {
    setIsProcessing(true);
    
    $.upload("upload/", 
      videoFile,
      (response: any)=>{
        let file_path = response.data[1];
        $.post("yolo/video", {
          model: model.key,
          param:{
            filePath: file_path,
          }
        },
            (response :any)=>{
              setIsProcessing(false);
              let url = response.data;
              setVideoSource(url);
            },
          );
      });
  }

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

            {model.key.indexOf("video") < 0 && <div className="space-y-6">
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
                    accept="*"
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
                    {/* <Button variant="secondary">Choose File</Button> */}
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
                <div className="result-box">
                  <div className="p-4 bg-gray-50 rounded-lg break-all">
                    <h4 className="font-semibold mb-2">Results:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-line">{result}</pre>
                  </div>
                </div>
              )}
              </div>
            }

            { model.key.indexOf("video") > -1 && 
            <div className="space-y-6">
              {videoFile ? 
              <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                <p>{videoFile.name}</p>
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setVideoFile(null)}
                  >
                    Change Video
                  </Button>
              </div>
              :
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
            <input
              type="file"
              accept="*"
              onChange={handleVideoUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-center"
            >
              <div className="text-gray-600 mb-2">
                Click to upload an Video
              </div>
              {/* <Button variant="secondary">Choose File</Button> */}
            </label>
          </div>
          }
              <Button
                className="w-full"
                disabled={isProcessing}
                onClick={handleVideoProcess}
              >
                {isProcessing ? "Processing..." : "Analyze Video"}
              </Button>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
                <video ref={videoRef} src={videoSource} controls className="w100"/>
              </div>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  );
}