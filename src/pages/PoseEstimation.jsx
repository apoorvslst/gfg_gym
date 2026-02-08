import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import {
    getAngleRuleForExercise,
    resolveLandmark,
    getLandmarkPoint,
    angleAtVertex,
    validateAngle,
} from '../utils/csvParserNew';

// Face Mesh Indices
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

function eyeAspectRatio(landmarks, indices) {
    const p = (i) => landmarks[indices[i]];
    const vert1 = Math.hypot(p(1).x - p(5).x, p(1).y - p(5).y);
    const vert2 = Math.hypot(p(2).x - p(4).x, p(2).y - p(4).y);
    const horiz = Math.hypot(p(0).x - p(3).x, p(0).y - p(3).y);
    return (vert1 + vert2) / (2 * horiz) || 0;
}

function mouthAspectRatio(landmarks) {
    const top = landmarks[13];
    const bottom = landmarks[14];
    const left = landmarks[78];
    const right = landmarks[308];
    const height = Math.hypot(top.x - bottom.x, top.y - bottom.y);
    const width = Math.hypot(left.x - right.x, left.y - right.y);
    return height / width || 0;
}

export default function PoseEstimation() {
    const { exerciseName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const poseRef = useRef(null);
    const faceMeshRef = useRef(null);
    const cameraRef = useRef(null);

    const [angleRule, setAngleRule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState({ valid: false, message: 'Align Body', currentAngle: 0, status: 'unknown', color: 'gray' });
    const [isPaused, setIsPaused] = useState(false);
    const [incidentLog, setIncidentLog] = useState([]);
    const [painDetected, setPainDetected] = useState(false);

    // Rep Stats
    const [goodReps, setGoodReps] = useState(0);
    const [wrongReps, setWrongReps] = useState(0);
    const [setsCompleted, setSetsCompleted] = useState(0);
    const [repsPerSet, setRepsPerSet] = useState(10);
    const goodRepsRef = useRef(0);

    // Logic Refs
    const isPausedRef = useRef(false);
    const painFrameCount = useRef(0);
    const repState = useRef('neutral');
    const holdTimer = useRef(0);
    const lastSpokenTime = useRef(0);
    const targetHold = useRef(0);
    const startHold = useRef(0);
    const frameHold = useRef(0);
    const lastStatus = useRef('unknown');

    const decodedExerciseName = exerciseName ? decodeURIComponent(exerciseName) : '';

    // Voice Feedback
    const speak = useCallback((text) => {
        if (!text || isPausedRef.current) return;
        const now = Date.now();
        if (now - lastSpokenTime.current < 2500) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
        lastSpokenTime.current = now;
    }, []);

    const logPainIncident = useCallback((reason) => {
        const time = new Date().toLocaleTimeString();
        setIncidentLog(prev => [...prev, { time, reason }]);
        setIsPaused(true);
        setPainDetected(true);
        isPausedRef.current = true;
        speak(`Workout paused. ${reason}`);
    }, [speak]);

    // Load Rules
    useEffect(() => {
        getAngleRuleForExercise(decodedExerciseName)
            .then(rule => {
                setAngleRule(rule);
                if (!rule) setError("No data found for this exercise");
                setLoading(false);
            })
            .catch(e => {
                setError(e.message);
                setLoading(false);
            });
    }, [decodedExerciseName]);

    // MediaPipe Setup
    useEffect(() => {
        if (loading || error) return;

        const onPoseResults = (results) => {
            if (isPausedRef.current) return;

            const video = webcamRef.current?.video;
            const canvas = canvasRef.current;
            if (!video || !canvas) return;

            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (results.poseLandmarks) {
                drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
                drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1 });

                if (angleRule) {
                    const rules = angleRule.rules || [angleRule];
                    const isPhysio = location.state?.mode === 'physio';

                    let targetZoneCount = 0;
                    let startZoneCount = 0;
                    let validCount = 0;
                    let firstResult = null;
                    let failingJoints = [];

                    // Evaluate all rules
                    rules.forEach((rule, index) => {
                        const aRes = resolveLandmark(rule.landmarkA);
                        const bRes = resolveLandmark(rule.primaryVertex);
                        const cRes = resolveLandmark(rule.landmarkC);

                        const ptA = getLandmarkPoint(results.poseLandmarks, aRes);
                        const ptB = getLandmarkPoint(results.poseLandmarks, bRes);
                        const ptC = getLandmarkPoint(results.poseLandmarks, cRes);

                        const angle = angleAtVertex(ptA, ptB, ptC);
                        const res = validateAngle(angle, rule, { isPhysio });

                        if (index === 0) firstResult = res;

                        const isTarget = res.status === 'target' || res.status === 'overshoot';
                        const isStart = res.status === 'start' || res.status === 'undershoot';

                        if (isTarget) targetZoneCount++;
                        else {
                            // Identify failing joints for "Careful Analysis"
                            let niceName = rule.jointName || "Joint";
                            niceName = niceName.replace(/_/g, ' ').replace(' angles', '').replace('right', 'R').replace('left', 'L');
                            failingJoints.push({ name: niceName, instruction: res.instruction });
                        }

                        if (isStart) startZoneCount++;
                        if (res.valid) validCount++;
                    });

                    if (!firstResult) return;

                    // Heuristic
                    const THRESHOLD = Math.max(1, Math.min(3, Math.ceil(rules.length * 0.6)));
                    const isOverallTarget = targetZoneCount >= THRESHOLD;

                    // Feedback Message
                    let uiMessage = rules.length > 1 ? `Matches: ${validCount}/${rules.length}` : firstResult.message;
                    let mainInstruction = firstResult.instruction;

                    // "Careful Analysis" for Physio: specific feedback
                    if (isPhysio && !isOverallTarget && failingJoints.length > 0) {
                        uiMessage = `Fix: ${failingJoints[0].name}`; // "Fix: R Elbow"
                        mainInstruction = failingJoints[0].instruction;
                    } else if (isOverallTarget) {
                        uiMessage = "Perfect! Hold.";
                    }

                    setFeedback({
                        ...firstResult,
                        message: uiMessage,
                        color: isOverallTarget ? 'green' : (isPhysio ? 'yellow' : (firstResult.color || 'gray')) // Yellow for physio guidance
                    });

                    // Rep Logic
                    const REQUIRED_FRAMES = 3;

                    if (targetZoneCount >= THRESHOLD) {
                        targetHold.current += 1;
                        startHold.current = 0;
                    } else if (startZoneCount >= THRESHOLD) {
                        startHold.current += 1;
                        targetHold.current = 0;
                    } else {
                        targetHold.current = 0;
                        startHold.current = 0;
                    }

                    if (targetHold.current >= REQUIRED_FRAMES) {
                        if (repState.current === 'ready') repState.current = 'peak_hit';
                    }

                    if (startHold.current >= REQUIRED_FRAMES) {
                        if (repState.current === 'peak_hit') {
                            goodRepsRef.current += 1;
                            setGoodReps(goodRepsRef.current);
                            speak(String(goodRepsRef.current));
                            repState.current = 'ready';
                        } else {
                            repState.current = 'ready';
                        }
                    }

                    // Adaptive Speaking
                    if (mainInstruction) {
                        // Physio: Speak more often (30%) to guide form
                        // Gym: Speak less often (10%)
                        const chance = isPhysio ? 0.3 : 0.1;
                        if (Math.random() < chance) speak(mainInstruction);
                    }
                }
            }
        };

        // Initialize Pose
        const pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
        pose.setOptions({ modelComplexity: 1, smoothLandmarks: true });
        pose.onResults(onPoseResults);
        poseRef.current = pose;

        // Initialize Face
        (async () => {
            try {
                const { FaceMesh } = await import('@mediapipe/face_mesh');
                const fm = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
                fm.setOptions({ maxNumFaces: 1 });
                fm.onResults(results => {
                    if (isPausedRef.current) return;
                    if (results.multiFaceLandmarks?.[0]) {
                        const l = results.multiFaceLandmarks[0];
                        const lEar = eyeAspectRatio(l, LEFT_EYE);
                        const rEar = eyeAspectRatio(l, RIGHT_EYE);
                        const mar = mouthAspectRatio(l);

                        const squint = lEar < 0.2 && rEar < 0.2;
                        const grimace = mar > 0.15 && mar < 0.4 && (lEar < 0.25 || rEar < 0.25);

                        if (squint || grimace) {
                            painFrameCount.current++;
                            if (painFrameCount.current > 15) {
                                logPainIncident(squint && grimace ? "Pain (Squint+Grimace)" : squint ? "Pain (Squint)" : "Pain (Grimace)");
                                painFrameCount.current = 0;
                            }
                        } else {
                            painFrameCount.current = Math.max(0, painFrameCount.current - 1);
                        }
                    }
                });
                faceMeshRef.current = fm;
            } catch (e) { console.error("FaceMesh Error", e); }
        })();

        const camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
                if (!webcamRef.current?.video) return;
                await pose.send({ image: webcamRef.current.video });
                if (faceMeshRef.current && !isPausedRef.current) await faceMeshRef.current.send({ image: webcamRef.current.video });
            },
            width: 640, height: 480
        });
        camera.start();
        cameraRef.current = camera;

        return () => {
            camera.stop();
            pose.close();
            faceMeshRef.current?.close();
        }
    }, [loading, angleRule, logPainIncident, speak]);

    // Set Logic
    useEffect(() => {
        if (goodReps > 0 && goodReps % repsPerSet === 0) setSetsCompleted(s => s + 1);
    }, [goodReps, repsPerSet]);

    if (loading) return <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">Loading...</div>;
    if (error) return <div className="bg-gray-900 min-h-screen text-red-500 flex items-center justify-center">{error}</div>;

    // Card Color Logic
    const getCardColor = () => {
        switch (feedback.color) {
            case 'green': return 'bg-green-600';
            case 'blue': return 'bg-blue-600';
            case 'yellow': return 'bg-yellow-600';
            case 'red': return 'bg-red-600';
            default: return 'bg-gray-800';
        }
    };

    const cardColorClass = getCardColor();

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">Back</button>
                    <h1 className="text-xl font-bold">{decodedExerciseName}</h1>
                </div>
                <div className="flex gap-2">
                    <div className={`px-3 py-1 rounded text-sm font-bold ${isPaused ? 'bg-red-500' : 'bg-green-600'}`}>
                        {isPaused ? "PAUSED" : "Live"}
                    </div>
                    <button
                        onClick={() => { setIsPaused(false); isPausedRef.current = false; setPainDetected(false); }}
                        className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500"
                    >
                        Resume
                    </button>
                    <button
                        onClick={() => logPainIncident("Simulated Pain")}
                        className="px-3 py-1 bg-orange-600 rounded text-sm hover:bg-orange-500"
                    >
                        Simulate pain (demo)
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-64px)]">
                {/* Left: Camera */}
                <div className={`relative flex-1 bg-black border-r border-gray-800 flex items-center justify-center overflow-hidden
                 ${feedback.color === 'green' ? 'border-4 border-green-500' : feedback.color === 'red' ? 'border-4 border-red-500' : ''}
            `}>
                    <Webcam ref={webcamRef} className="absolute w-full h-full object-contain" />
                    <canvas ref={canvasRef} className="absolute w-full h-full object-contain z-10" />

                    {isPaused && (
                        <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center flex-col">
                            <h2 className="text-3xl font-bold text-red-500">PAUSED - Pain Detected</h2>
                            <button onClick={() => { setIsPaused(false); isPausedRef.current = false; setPainDetected(false); }} className="mt-4 bg-white text-black px-6 py-2 rounded-full font-bold">Resume Workout</button>
                        </div>
                    )}
                </div>

                {/* Right: Sidebar */}
                <div className="w-96 bg-gray-900 p-6 flex flex-col gap-6 overflow-y-auto">
                    {/* Visual Feedback Box (The "Card") */}
                    <div className="">
                        <h3 className="text-blue-400 font-semibold mb-2">Live Angle Feedback</h3>
                        <div className={`p-4 rounded-xl min-h-[100px] flex flex-col justify-center items-center shadow-lg transition-colors duration-300 ${cardColorClass}`}>
                            <div className="text-2xl font-bold text-white text-center">{feedback.message}</div>
                            {feedback.currentAngle > 0 && (
                                <div className="text-4xl font-mono font-black mt-2 text-white">
                                    {feedback.currentAngle.toFixed(0)}°
                                </div>
                            )}
                            <div className="text-xs text-white/70 mt-2 font-mono">
                                Target: {angleRule?.endRaw}
                            </div>
                        </div>
                    </div>

                    {/* Reps Section */}
                    <div>
                        <h3 className="text-blue-400 font-semibold mb-2">Reps & sets</h3>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="bg-gray-800 p-3 rounded">
                                <div className="text-xs text-gray-400 uppercase">Good Rep</div>
                                <div className="text-2xl font-bold text-green-500">{goodReps}</div>
                            </div>
                            <div className="bg-gray-800 p-3 rounded">
                                <div className="text-xs text-gray-400 uppercase">Wrong Rep</div>
                                <div className="text-2xl font-bold text-red-500">{wrongReps}</div>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded mb-2">
                            <div className="text-xs text-gray-400 uppercase">Sets Completed</div>
                            <div className="text-2xl font-bold text-yellow-500">{setsCompleted}</div>
                        </div>

                        <div className="bg-gray-800 p-3 rounded">
                            <label className="text-xs text-gray-400 block mb-1">Reps per set</label>
                            <input
                                type="number"
                                value={repsPerSet}
                                onChange={(e) => setRepsPerSet(Number(e.target.value))}
                                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white"
                            />
                        </div>
                    </div>

                    {/* Incident Log */}
                    <div className="flex-1 min-h-[100px]">
                        <h3 className="text-red-400 font-semibold mb-2">Pain Incidents</h3>
                        {incidentLog.length === 0 ? (
                            <div className="text-sm text-gray-500 italic">No pain detected.</div>
                        ) : (
                            <div className="space-y-1">
                                {incidentLog.map((log, i) => (
                                    <div key={i} className="text-xs bg-red-900/30 border border-red-900 p-2 rounded text-red-200">
                                        <span className="font-bold">{log.time}</span> • {log.reason}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
