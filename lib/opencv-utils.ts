// Function to process images with YOLO detection results
export function processImageWithYOLO(model: string, imageElement: HTMLImageElement, yoloResult: any, video_ratio:number, size_ratio:number) {
    let ret = null;

    if (model.indexOf("cls") > 0){

    }else if(model.indexOf("obb") > 0){
        ret = processImageWithYOLOObb(imageElement, yoloResult, video_ratio, size_ratio);
    }else if(model.indexOf("pose") > 0){
        ret = processImageWithYOLOPose(imageElement, yoloResult, video_ratio, size_ratio);
    }else if(model.indexOf("seg") > 0){
        ret = processImageWithYOLOSegmentation(imageElement, yoloResult, video_ratio, size_ratio);
    }else{
        ret = processImageWithYOLODetection(imageElement, yoloResult, video_ratio, size_ratio);
    }

    return ret;
}

export function processImageWithYOLODetection(imageElement: HTMLImageElement, yoloResult: any, video_ratio:number, size_ratio:number) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);
    let dst = new cv.Mat();
    let dsize = new cv.Size(imageElement.height*video_ratio, imageElement.height);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA); 

    // Loop through YOLO results and draw bounding boxes
    const { cls, conf, xyxy } = yoloResult.detections[0].boxes;
    let i = 0;
    while( i < xyxy.length){
        const [x1, y1, x2, y2] = xyxy[i];
    
        // Draw rectangle around detected object
        const color = new cv.Scalar(255, 0, 0, 200); // Color: Blue
        cv.rectangle(dst, new cv.Point(size_ratio*x1, size_ratio*y1), new cv.Point(size_ratio*x2, size_ratio*y2), color, 2, cv.LINE_8);

        // Put label with cls and conf
        const label = `${yoloResult.names[cls[i]]}: ${conf[i].toFixed(2)}`;
        cv.putText(dst, label, new cv.Point(size_ratio*x1, size_ratio*(y1 - 10)), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(0, 255, 0, 200), 2);
        i++;
    }

    // Display the result
    cv.imshow('outputCanvas', dst);
    src.delete();
}

export function processImageWithYOLOObb(imageElement: HTMLImageElement, yoloResult: any, video_ratio:number, size_ratio:number) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);
    let dst = new cv.Mat();
    let dsize = new cv.Size(imageElement.height*video_ratio, imageElement.height);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA); 

    // Loop through YOLO OBB results and draw oriented bounding boxes
    const { cls, conf, xyxyxyxy } = yoloResult.detections[0].obb;
    let i = 0;

    const color = new cv.Scalar(255, 0, 0, 200); // Color: Blue
    for ( let points of xyxyxyxy) {
        for ( let i=0; i < 4; i++){
            if(i == 3){
                cv.line(dst, new cv.Point(points[0][0] * size_ratio, points[0][1]* size_ratio), 
                 new cv.Point(points[3][0] * size_ratio, points[3][1]* size_ratio), color, 2, cv.LINE_8);

            }else{
                cv.line(dst, new cv.Point(points[i][0] * size_ratio, points[i][1]* size_ratio), 
                new cv.Point(points[i + 1][0] * size_ratio, points[i + 1][1]* size_ratio), color, 2, cv.LINE_8);
            }
        }
    }

    // Put label with cls and conf
    // const label = `${yoloResult.names[cls[i]]}: ${conf[i].toFixed(2)}`;
    // cv.putText(dst, label, new cv.Point(size_ratio*cx, size_ratio*(cy - 10)), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(0, 255, 0, 200), 2);
    // Display the result
    cv.imshow('outputCanvas', dst);
    src.delete();
    dst.delete();
}

// Function to process and display imageElement with YOLO segmentation results
export function processImageWithYOLOSegmentation(imageElement: HTMLImageElement, yoloSegmentationResult: any, video_ratio:number, size_ratio:number) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);
    let dst = new cv.Mat();
    let dsize = new cv.Size(imageElement.height*video_ratio, imageElement.height);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA); 

    // Loop through YOLO segmentation results and draw masks
    const { xy } = yoloSegmentationResult.detections[0].masks;

    for (let points of xy){
        let i = 0;
        let color = new cv.Scalar(0, 255, 0, 200); // Red color
        while (i < points.length){
            let pt1 = new cv.Point(points[i][0] * size_ratio, points[i][1] * size_ratio);
            let pt2;
            if (i == points.length -1){
                pt2 = new cv.Point(points[0][0] * size_ratio, points[0][1] * size_ratio);
            }else{
                pt2 = new cv.Point(points[i+1][0] * size_ratio, points[i+1][1] * size_ratio);
            }
            cv.line(dst, pt1, pt2, color, 2, cv.LINE_8);
            i++;
        }
    }

    // Display the result
    cv.imshow('outputCanvas', dst);
    dst.delete();
}

// Function to process and display imageElement with YOLO pose results
export function processImageWithYOLOPose(imageElement: HTMLImageElement, yoloPoseResult: any, video_ratio:number, size_ratio:number) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);
    let dst = new cv.Mat();
    let dsize = new cv.Size(imageElement.height*video_ratio, imageElement.height);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA); 

    // Loop through YOLO pose results and draw keypoints and skeletons
    const { keypoints } = yoloPoseResult.detections[0];
    let { conf, xy } = keypoints;

    // Draw keypoints
    let i = 0;
    while (i < xy.length){        
        let j = 0;
        let points = xy[i];
        while (j < points.length){
            const [x, y] = points[i];
            if (conf[i] > 0.5) {
                cv.circle(dst, new cv.Point(size_ratio * x, size_ratio * y), 3, new cv.Scalar(0, 0, 255, 200), -1); // Color: Red
                // cv.putText(dst, j.toString(), new cv.Point(size_ratio * x, size_ratio * y), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(255, 0, 0, 200), 1); // Display index i
            }
            j++;
        }
        i++;
    }
        
        // Draw skeleton lines
        const skeleton = [
            [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], //head
            [4, 6], [6, 8], [8, 10], [6, 12], [12, 14], [14, 16], //right
            [3, 5], [5, 7], [7, 9], [5, 11], [11, 13], [13, 15], //left
            [11, 12], [5, 6]

        ];

    skeleton.forEach(([start, end]) => {
        let i = 0;
        while(i < xy.length){
            const [x1, y1] = xy[i][start];
            const [x2, y2] = xy[i][end];
            const confidence1 = conf[i][start];
            const confidence2 = conf[i][end];
            
            if (confidence1 > 0.5 && confidence2 > 0.5) {
                cv.line(dst, new cv.Point(size_ratio * x1, size_ratio * y1), new cv.Point(size_ratio * x2, size_ratio * y2), new cv.Scalar(0, 255, 0, 255), 2); // Color: Green
            }
            i++;
        }


    });

    // Display the result
    cv.imshow('outputCanvas', dst);
    dst.delete();
}

// Function to process face detection results from Luxand
export function processImageWithLuxandFaceDetection(imageElement: HTMLImageElement, luxandResults: any[], video_ratio:number, size_ratio:number) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);

    // Loop through Luxand results and draw bounding boxes
    luxandResults.forEach(result => {
        const { x, y, width, height } = result;

        // Draw rectangle around detected face
        const color = new cv.Scalar(0, 255, 0, 200); // Color: Green
        cv.rectangle(src, new cv.Point(x, y), new cv.Point(x + width, y + height), color, 1, cv.LINE_8);

        // Put label with "Face"
        const label = "Face";
        cv.putText(src, label, new cv.Point(x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.5, color, 2);
    });

    // Display the result
    cv.imshow('outputCanvas', src);
    src.delete();
}

// Function to process face images with Luxand's face feature extraction results
export function processImageWithLuxandFaceFeatures(imageElement: HTMLImageElement, luxandResult: any, video_ratio:number, size_ratio:number) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);
    let dst = new cv.Mat();
    let dsize = new cv.Size(imageElement.height*video_ratio, imageElement.height);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA); 

    // Loop through Luxand results and draw face features
    const { xc, yc, w, angle, padding, features } = luxandResult;

    // Draw rectangle around detected face
    const rectColor = new cv.Scalar(0, 255, 0, 200); // Color: Red
    cv.rectangle(dst, new cv.Point(size_ratio*(xc - w*0.6), size_ratio*(yc - w*0.5)), new cv.Point(size_ratio*(xc + w*0.6), size_ratio*(yc + w*0.7)), rectColor, 2, cv.LINE_4);

    // Draw face features
    features.forEach((feature: number[]) => {
        const fx = size_ratio * feature[0];
        const fy = size_ratio * feature[1];
        cv.circle(dst, new cv.Point(fx, fy), 2, new cv.Scalar(255, 0, 0, 200), -1); // Color: Blue
    });

    // Display the result
    cv.imshow('outputCanvas', dst);
    dst.delete();
}

export function showImage(imageElement: HTMLImageElement, video_ratio:number, size_ratio:number) {
    // Convert HTMLImageElement to OpenCV Mat
    const src = cv.imread(imageElement);
    let dst = new cv.Mat();
    let dsize = new cv.Size(imageElement.height*video_ratio, imageElement.height);
    cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA); 
    cv.imshow('outputCanvas', dst);
    src.delete();
    dst.delete();
}