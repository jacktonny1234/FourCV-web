// import cv from 'opencv.js'; // Import OpenCV
// import cv from 'opencv.js'; // Import OpenCV

import { number } from "zod";

// Function to process images with YOLO detection results
export function processImageWithYOLO(imageElement: HTMLImageElement, yoloResults: any[]) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);

    // Loop through YOLO results and draw bounding boxes
    yoloResults.forEach(result => {
        const { classId, confidence, bbox } = result;
        const [x, y, width, height] = bbox;

        // Draw rectangle around detected object
        const color = new cv.Scalar(255, 0, 0); // Color: Blue
        cv.rectangle(src, new cv.Point(x, y), new cv.Point(x + width, y + height), color, 2, cv.LINE_8);

        // Put label with classId and confidence
        const label = `${classId}: ${confidence.toFixed(2)}`;
        cv.putText(src, label, new cv.Point(x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, color, 2);
    });

    // Display the result
    cv.imshow('outputCanvas', src);
    src.delete();
}

// Function to process and display imageElement with YOLO segmentation results
export function processImageWithYOLOSegmentation(imageElement: HTMLImageElement, yoloSegmentationResults: any[]) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);

    // Loop through YOLO segmentation results and draw masks
    yoloSegmentationResults.forEach(result => {
        const { classId, confidence, mask } = result;

        // Create a mask Mat from the segmentation result
        const maskMat = cv.matFromArray(mask.length, mask[0].length, cv.CV_8UC1, mask);

        // Create a color Mat for the mask
        const color = new cv.Mat(maskMat.rows, maskMat.cols, cv.CV_8UC3, new cv.Scalar(0, 255, 0)); // Color: Green

        // Apply the mask to the source image
        src.setTo(color, maskMat);

        // Put label with classId and confidence
        const label = `${classId}: ${confidence.toFixed(2)}`;
        cv.putText(src, label, new cv.Point(10, 30), cv.FONT_HERSHEY_SIMPLEX, 1, new cv.Scalar(255, 255, 255), 2);
    });

    // Display the result
    cv.imshow('outputCanvas', src);
    src.delete();
}

// Function to process face detection results from Luxand
export function processImageWithLuxandFaceDetection(imageElement: HTMLImageElement, luxandResults: any[]) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);

    // Loop through Luxand results and draw bounding boxes
    luxandResults.forEach(result => {
        const { x, y, width, height } = result;

        // Draw rectangle around detected face
        const color = new cv.Scalar(0, 255, 0); // Color: Green
        cv.rectangle(src, new cv.Point(x, y), new cv.Point(x + width, y + height), color, 2, cv.LINE_8);

        // Put label with "Face"
        const label = "Face";
        cv.putText(src, label, new cv.Point(x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, color, 2);
    });

    // Display the result
    cv.imshow('outputCanvas', src);
    src.delete();
}

// Function to process face images with Luxand's face feature extraction results
export function processImageWithLuxandFaceFeatures(imageElement: HTMLImageElement, luxandResult: any) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);

    // Loop through Luxand results and draw face features
    const { xc, yc, w, angle, padding, features } = luxandResult;

    // Draw rectangle around detected face
    const color = new cv.Scalar(0, 255, 0); // Color: Green
    cv.rectangle(src, new cv.Point(xc - w/2, yc - w/2), new cv.Point(xc + w/2, yc + w/2), color, 2, cv.LINE_8);

    // Draw face features
    features.forEach((feature: number[]) => {
        const fx = feature[0];
        const fy = feature[1];
        cv.circle(src, new cv.Point(fx, fy), 2, new cv.Scalar(255, 0, 0), -1); // Color: Blue
    });

    // Display the result
    cv.imshow('outputCanvas', src);
    src.delete();
}
