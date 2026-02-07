import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

const exerciseFiles = [
    '/ankles&calves.csv',
    '/core and lower back.csv',
    '/Hips & Glutes.csv',
    '/knees_quadrants.csv',
    '/neckexercise.csv',
    '/shoulder-_-rotated-cuff.csv',
];

const landmarkMap = {
    'LEFT_SHOULDER': 11, 'LEFT_ELBOW': 13, 'LEFT_WRIST': 15,
    'RIGHT_SHOULDER': 12, 'RIGHT_ELBOW': 14, 'RIGHT_WRIST': 16,
    'LEFT_HIP': 23, 'LEFT_KNEE': 25, 'LEFT_ANKLE': 27,
    'RIGHT_HIP': 24, 'RIGHT_KNEE': 26, 'RIGHT_ANKLE': 28,
    'NOSE': 0, 'LEFT_EAR': 7, 'RIGHT_EAR': 8,
};

function cal_angle(a, b, c) {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
        angle = 360 - angle;
    }
    return angle;
}


export default function PoseEstimation() {
    const { exerciseName } = useParams();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [poseLandmarker, setPoseLandmarker] = useState(null);
    const [webcamRunning, setWebcamRunning] = useState(false);
    const [exerciseData, setExerciseData] = useState(null);
    const [feedback, setFeedback] = useState({ message: 'Initializing...', color: 'text-gray-900' });
    let animationFrameId;

    useEffect(() => {
        async function createPoseLandmarker() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            const landmarker = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numPoses: 1
            });
            setPoseLandmarker(landmarker);
        }
        createPoseLandmarker();
    }, []);

    useEffect(() => {
        async function loadExerciseData() {
            for (const file of exerciseFiles) {
                try {
                    const response = await fetch(file);
                    const csvText = await response.text();
                    const lines = csvText.split('\n').filter(line => line.trim());
                    const headers = lines[0].split(',').map(h => h.trim());
                    const jsonData = [];
                    
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim());
                        const row = {};
                        headers.forEach((header, index) => {
                            row[header] = values[index];
                        });
                        jsonData.push(row);
                    }

                    const currentExercise = jsonData.find(ex => {
                        const exName = (ex['Exercise Name'] || '').toString().toLowerCase().trim();
                        const searchName = decodeURIComponent(exerciseName).toLowerCase().trim();
                        return exName === searchName || exName.includes(searchName) || searchName.includes(exName);
                    });
                    
                    if (currentExercise) {
                        setExerciseData(currentExercise);
                        return;
                    }
                } catch (error) {
                    console.error("Error loading exercise data:", error);
                }
            }
        }

        if (exerciseName) {
            loadExerciseData();
        }
    }, [exerciseName]);


    useEffect(() => {
        if (poseLandmarker && !webcamRunning) {
            enableWebcam();
        }
    }, [poseLandmarker]);

    const enableWebcam = async () => {
        if (!poseLandmarker) {
            console.log("Wait! poseLandmarker not loaded yet.");
            return;
        }

        if (webcamRunning) {
            setWebcamRunning(false);
            const stream = videoRef.current.srcObject;
            stream.getTracks().forEach(track => track.stop());
        } else {
            setWebcamRunning(true);
            const constraints = { video: true };
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener("loadeddata", predictWebcam);
            });
        }
    };

    const predictWebcam = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        const drawingUtils = new DrawingUtils(canvasCtx);

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        let lastVideoTime = -1;
        const renderLoop = () => {
            const videoTime = video.currentTime;
            if (videoTime !== lastVideoTime) {
                lastVideoTime = videoTime;
                const startTimeMs = performance.now();
                poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                    for (const landmark of result.landmarks) {
                        drawingUtils.drawLandmarks(landmark, {
                            radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
                        });
                        drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);

                        // Posture analysis logic
                        if (exerciseData) {
                            const primaryVertex = exerciseData['Primary Vertex'];
                            const landmarkA = exerciseData['Landmark A'];
                            const landmarkC = exerciseData['Landmark C'];
                            
                            // Extract landmark indices from format like "Ear (7/8)" or "Nose (0)"
                            const extractIndex = (str) => {
                                if (!str) return null;
                                const match = str.match(/\((\d+)/);
                                return match ? parseInt(match[1]) : null;
                            };
                            
                            const joint1Idx = extractIndex(landmarkA);
                            const joint2Idx = extractIndex(primaryVertex);
                            const joint3Idx = extractIndex(landmarkC);
                            
                            if (joint1Idx !== null && joint2Idx !== null && joint3Idx !== null) {
                                const joint1 = landmark[joint1Idx];
                                const joint2 = landmark[joint2Idx];
                                const joint3 = landmark[joint3Idx];

                                if (joint1 && joint2 && joint3) {
                                    const angle = cal_angle([joint1.x, joint1.y], [joint2.x, joint2.y], [joint3.x, joint3.y]);
                                    
                                    // Parse target angle from End Angle Range
                                    const angleRange = exerciseData['End Angle Range'] || '';
                                    const rangeMatch = angleRange.match(/(\d+)[^\d]+(\d+)/);
                                    
                                    if (rangeMatch) {
                                        const targetMin = parseFloat(rangeMatch[1]);
                                        const targetMax = parseFloat(rangeMatch[2]);
                                        
                                        if (angle >= targetMin && angle <= targetMax) {
                                            setFeedback({ message: 'Good form! ✓', color: 'text-green-500' });
                                        } else {
                                            setFeedback({ message: 'Adjust your form', color: 'text-red-500' });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    canvasCtx.restore();
                });
            }
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();
    };

    useEffect(() => {
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);


    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Pose Estimation</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Analyzing your form for: {decodeURIComponent(exerciseName)}
                    </p>
                    <div className="mt-4">
                    {exerciseData && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                            <p className="text-blue-800 font-semibold">Exercise: {exerciseData['Exercise Name']}</p>
                            <p className="text-sm text-blue-600">Target: {exerciseData['End Angle Range']}</p>
                        </div>
                    )}
                    <p className={`text-2xl font-bold ${feedback.color}`}>{feedback.message}</p>
                </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="relative">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-lg"></video>
                        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
                    </div>
                    <button
                        onClick={enableWebcam}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                    >
                        {webcamRunning ? 'Stop Webcam' : 'Start Webcam'}
                    </button>
                </div>
            </div>
        </div>
    );
}
