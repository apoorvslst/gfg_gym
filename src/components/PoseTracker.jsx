import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

const PoseTracker = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [jsonOutput, setJsonOutput] = useState(null);

    const onResults = (results) => {
        if (!canvasRef.current || !webcamRef.current?.video) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw video frame
        // canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw landmarks
        if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                { color: '#00FF00', lineWidth: 4 });
            drawLandmarks(canvasCtx, results.poseLandmarks,
                { color: '#FF0000', lineWidth: 2 });

            // Calculate Vectors & Update JSON
            processLandmarks(results.poseLandmarks);
        }
        canvasCtx.restore();
    };

    const calculateAngle = (a, b, c) => {
        const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) angle = 360 - angle;
        return angle;
    };

    const processLandmarks = (landmarks) => {
        const keypoints = {
            nose: landmarks[0],
            left_shoulder: landmarks[11],
            right_shoulder: landmarks[12],
            left_elbow: landmarks[13],
            right_elbow: landmarks[14],
            left_wrist: landmarks[15],
            right_wrist: landmarks[16],
            left_hip: landmarks[23],
            right_hip: landmarks[24],
            left_knee: landmarks[25],
            right_knee: landmarks[26],
            left_ankle: landmarks[27],
            right_ankle: landmarks[28]
        };

        const angles = {
            left_elbow_angle: calculateAngle(keypoints.left_shoulder, keypoints.left_elbow, keypoints.left_wrist),
            right_elbow_angle: calculateAngle(keypoints.right_shoulder, keypoints.right_elbow, keypoints.right_wrist),
            left_shoulder_angle: calculateAngle(keypoints.left_hip, keypoints.left_shoulder, keypoints.left_elbow),
            right_shoulder_angle: calculateAngle(keypoints.right_hip, keypoints.right_shoulder, keypoints.right_elbow),
            left_knee_angle: calculateAngle(keypoints.left_hip, keypoints.left_knee, keypoints.left_ankle),
            right_knee_angle: calculateAngle(keypoints.right_hip, keypoints.right_knee, keypoints.right_ankle),
            left_hip_angle: calculateAngle(keypoints.left_shoulder, keypoints.left_hip, keypoints.left_knee),
            right_hip_angle: calculateAngle(keypoints.right_shoulder, keypoints.right_hip, keypoints.right_knee),
        };

        const data = {
            timestamp: Date.now(),
            angles: angles,
            // keypoints: keypoints // Uncomment to include raw coordinates (can be large)
        };

        setJsonOutput(data);
    };

    useEffect(() => {
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);

        if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null) {
            const camera = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    if (webcamRef.current?.video) {
                        await pose.send({ image: webcamRef.current.video });
                    }
                },
                width: 640,
                height: 480
            });
            camera.start();
        }
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
            {/* Left: Camera Feed & Overlay */}
            <div className="relative w-full md:w-2/3 h-1/2 md:h-full flex items-center justify-center bg-black">
                <Webcam
                    ref={webcamRef}
                    className="absolute inset-0 w-full h-full object-contain"
                    width={640}
                    height={480}
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-contain z-10"
                />
            </div>

            {/* Right: Live Data JSON */}
            <div className="w-full md:w-1/3 h-1/2 md:h-full bg-gray-800 p-4 overflow-y-auto border-l border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Live Vector Analysis (JSON2)</h2>
                <div className="bg-gray-900 p-4 rounded-lg font-mono text-xs text-green-400 break-words whitespace-pre-wrap shadow-inner">
                    {jsonOutput ? JSON.stringify(jsonOutput, null, 2) : "Creating Vector Space..."}
                </div>
            </div>
        </div>
    );
};

export default PoseTracker;
