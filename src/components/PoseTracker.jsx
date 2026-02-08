import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { hipThrustData } from '../data/hipThrustData';

const PoseTracker = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [jsonOutput, setJsonOutput] = useState(null);

    // View State
    const [selectedView, setSelectedView] = useState('side_right');
    const selectedViewRef = useRef('side_right');

    // Analysis State
    const [analysisResult, setAnalysisResult] = useState(null);

    // Rep Counting State (Refs for mutable state in callback, State for UI)
    const repCountRef = useRef(0);
    const exerciseStateRef = useRef('down'); // 'down', 'up'
    const [repCount, setRepCount] = useState(0);

    useEffect(() => {
        selectedViewRef.current = selectedView;
        // Reset reps on view change? Optional. Let's keep it simple.
    }, [selectedView]);

    const onResults = (results) => {
        if (!canvasRef.current || !webcamRef.current?.video) return;

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

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

    const analyzePose = (angles) => {
        const referenceData = hipThrustData['hip thrust'].views[selectedViewRef.current]?.correct?.joints;

        if (!referenceData) return null;

        const results = {};
        let isCorrect = true;

        // Map current angles to reference keys
        const angleMapping = {
            'right_elbow_angles': angles.right_elbow_angle,
            'right_knee_angles': angles.right_knee_angle,
            'right_hip_angles': angles.right_hip_angle,
            'left_elbow_angles': angles.left_elbow_angle,
            'left_knee_angles': angles.left_knee_angle
            // Add more mappings if needed
        };

        for (const [key, refStats] of Object.entries(referenceData)) {
            const currentAngle = angleMapping[key];
            if (currentAngle !== undefined) {
                const isValid = currentAngle >= refStats.min_sigma && currentAngle <= refStats.max_sigma;
                results[key] = {
                    current: currentAngle.toFixed(2),
                    expectedMin: refStats.min_sigma,
                    expectedMax: refStats.max_sigma,
                    isValid: isValid
                };
                if (!isValid) isCorrect = false;
            }
        }

        return { details: results, isOverallCorrect: isCorrect };
    };

    const countReps = (angles) => {
        const view = selectedViewRef.current;
        let hipAngle = 0;

        // Determine relevant hip angle based on view
        if (view === 'side_right') {
            hipAngle = angles.right_hip_angle;
        } else if (view === 'side_left') {
            hipAngle = angles.left_hip_angle;
        } else {
            // Front view might use both or average? sticking to right for default
            hipAngle = angles.right_hip_angle;
        }

        // Hip Thrust Thresholds
        // Down (Flexed): < 100 degrees (hips bent) - Tuned based on min 40 in ref
        // Up (Extended): > 160 degrees (hips straight) - Tuned based on max 179 in ref
        const UP_THRESHOLD = 160;
        const DOWN_THRESHOLD = 100;

        if (exerciseStateRef.current === 'down') {
            if (hipAngle > UP_THRESHOLD) {
                exerciseStateRef.current = 'up';
            }
        } else if (exerciseStateRef.current === 'up') {
            if (hipAngle < DOWN_THRESHOLD) {
                exerciseStateRef.current = 'down';
                repCountRef.current += 1;
                setRepCount(repCountRef.current); // Update UI
            }
        }
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

        const analysis = analyzePose(angles);
        countReps(angles);

        const data = {
            timestamp: Date.now(),
            angles: angles,
            analysis: analysis
        };

        setJsonOutput(data);
        setAnalysisResult(analysis);
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
        <div className="flex flex-col md:flex-row w-full h-full min-h-[500px] bg-gray-900 text-white overflow-hidden rounded-xl">
            {/* Camera Feed & Overlay - Full Width */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
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

                {/* Analysis Overlay */}
                <div className="absolute top-4 left-4 bg-black/70 p-4 rounded-lg text-xs z-20 max-w-xs overflow-auto max-h-[90%]">
                    <div className="mb-2 font-bold text-lg">Pose Analysis</div>

                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <label className="mr-2">View:</label>
                            <select
                                value={selectedView}
                                onChange={(e) => setSelectedView(e.target.value)}
                                className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
                            >
                                <option value="side_right">Side Right</option>
                                <option value="side_left">Side Left</option>
                                <option value="front">Front</option>
                            </select>
                        </div>
                        <div className="text-xl font-bold bg-blue-600 px-3 py-1 rounded">
                            Reps: {repCount}
                        </div>
                    </div>

                    {analysisResult && (
                        <div>
                            <div className={`text-lg font-bold mb-2 p-2 rounded text-center border-2 
                                ${analysisResult.isOverallCorrect
                                    ? 'bg-green-600/30 border-green-500 text-white'
                                    : 'bg-red-600/30 border-red-500 text-white'}`}>
                                {analysisResult.isOverallCorrect ? 'CORRECT FORM' : 'New Form'}
                            </div>
                            <div className="space-y-1">
                                {Object.entries(analysisResult.details).map(([key, data]) => (
                                    <div key={key} className={`flex justify-between p-1 rounded ${data.isValid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                        <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                                        <span className={data.isValid ? 'text-green-300 font-bold' : 'text-red-300 font-bold'}>
                                            {data.current}°
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PoseTracker;
