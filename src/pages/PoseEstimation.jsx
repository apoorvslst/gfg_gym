import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '../utils/csvParser';

// Face Mesh: eye aspect ratio (squint) and mouth (grimace) indices
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];
const MOUTH_INNER = [13, 14, 78, 308, 312, 317, 82, 87];

function eyeAspectRatio(landmarks, indices) {
  const p = (i) => landmarks[indices[i]];
  const vert1 = Math.hypot(p(1).x - p(5).x, p(1).y - p(5).y);
  const vert2 = Math.hypot(p(2).x - p(4).x, p(2).y - p(4).y);
  const horiz = Math.hypot(p(0).x - p(3).x, p(0).y - p(3).y);
  if (horiz < 1e-6) return 0.3;
  return (vert1 + vert2) / (2 * horiz);
}

function mouthAspectRatio(landmarks) {
  const top = landmarks[13];
  const bottom = landmarks[14];
  const left = landmarks[78];
  const right = landmarks[308];
  const height = Math.hypot(top.x - bottom.x, top.y - bottom.y);
  const width = Math.hypot(left.x - right.x, left.y - right.y);
  if (width < 1e-6) return 0;
  return height / width;
}

export default function PoseEstimation() {
  const { exerciseName } = useParams();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);

  const [angleRule, setAngleRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({ valid: true, message: '', currentAngle: null });
  const [isPaused, setIsPaused] = useState(false);
  const [incidentLog, setIncidentLog] = useState([]);
  const [painDetected, setPainDetected] = useState(false);
  const [simulatePain, setSimulatePain] = useState(false);
  const [goodFormRepCount, setGoodFormRepCount] = useState(0);
  const [showGoodFormCelebration, setShowGoodFormCelebration] = useState(false);
  const painFrameCount = useRef(0);
  const isPausedRef = useRef(false);
  const simulatePainRef = useRef(false);
  const goodFormHoldFramesRef = useRef(0);
  const goodFormCooldownRef = useRef(0);
  const GOOD_FORM_HOLD_FRAMES = 20;
  const GOOD_FORM_COOLDOWN_FRAMES = 30;
  isPausedRef.current = isPaused;
  simulatePainRef.current = simulatePain;

  const decodedExerciseName = exerciseName ? decodeURIComponent(exerciseName) : '';

  useEffect(() => {
    let cancelled = false;
    getAngleRuleForExercise(decodedExerciseName)
      .then((rule) => {
        if (!cancelled) {
          setAngleRule(rule);
          setError(rule ? null : 'No angle data for this exercise.');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load exercise data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [decodedExerciseName]);

  useEffect(() => {
    if (!showGoodFormCelebration) return;
    const t = setTimeout(() => setShowGoodFormCelebration(false), 1200);
    return () => clearTimeout(t);
  }, [showGoodFormCelebration]);

  const logPainIncident = useCallback((reason) => {
    const entry = {
      time: new Date().toLocaleTimeString(),
      reason,
      exercise: decodedExerciseName,
    };
    setIncidentLog((prev) => [...prev, entry]);
    setIsPaused(true);
    setPainDetected(true);
    isPausedRef.current = true;
  }, [decodedExerciseName]);

  useEffect(() => {
    if (loading || error || !decodedExerciseName) return;

    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const video = webcamRef.current?.video;
    if (!video) {
      pose.close();
      return;
    }

    poseRef.current = pose;

    pose.onResults((results) => {
      const canvas = canvasRef.current;
      const video = webcamRef.current?.video;
      const ctx = canvas?.getContext('2d');
      if (canvas && video && ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      const landmarks = results.poseLandmarks;
      if (landmarks && ctx) {
        drawConnectors(ctx, landmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        drawLandmarks(ctx, landmarks, { color: '#FF0000', lineWidth: 1 });

        if (angleRule) {
          const vertexRes = resolveLandmark(angleRule.primaryVertex);
          const aRes = resolveLandmark(angleRule.landmarkA);
          const cRes = resolveLandmark(angleRule.landmarkC);
          const ptA = getLandmarkPoint(landmarks, aRes);
          const ptB = getLandmarkPoint(landmarks, vertexRes);
          const ptC = getLandmarkPoint(landmarks, cRes);
          const angle = angleAtVertex(ptA, ptB, ptC);
          const validation = validateAngle(angle, angleRule);
          setFeedback(validation);

          // Good-form rep: count when user holds good form for sustained frames
          if (validation.valid) {
            if (goodFormCooldownRef.current > 0) {
              goodFormCooldownRef.current--;
            } else {
              goodFormHoldFramesRef.current++;
              if (goodFormHoldFramesRef.current >= GOOD_FORM_HOLD_FRAMES) {
                goodFormHoldFramesRef.current = 0;
                goodFormCooldownRef.current = GOOD_FORM_COOLDOWN_FRAMES;
                setGoodFormRepCount((prev) => prev + 1);
                setShowGoodFormCelebration(true);
              }
            }
          } else {
            goodFormHoldFramesRef.current = 0;
          }
        }
      }
    });

    const setupFaceMesh = (fm) => {
      fm.onResults((results) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const landmarks = results.multiFaceLandmarks?.[0];
        if (landmarks && ctx && canvas) {
          drawLandmarks(ctx, landmarks, { color: '#00FFFF', lineWidth: 0.5, radius: 1 });
          if (!isPausedRef.current && !simulatePainRef.current) {
            const leftEAR = eyeAspectRatio(landmarks, LEFT_EYE);
            const rightEAR = eyeAspectRatio(landmarks, RIGHT_EYE);
            const mar = mouthAspectRatio(landmarks);
            const squint = leftEAR < 0.2 && rightEAR < 0.2;
            const grimace = mar > 0.15 && mar < 0.4 && (leftEAR < 0.25 || rightEAR < 0.25);
            if (squint || grimace) {
              painFrameCount.current += 1;
              if (painFrameCount.current >= 8) {
                logPainIncident(squint && grimace ? 'Pain expression detected (squint + grimace)' : squint ? 'Squinting detected' : 'Grimacing detected');
                painFrameCount.current = 0;
              }
            } else {
              painFrameCount.current = Math.max(0, painFrameCount.current - 1);
            }
          }
        }
      });
    };

    (async () => {
      try {
        const { FaceMesh: FM } = await import('@mediapipe/face_mesh');
        const fm = new FM({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        fm.setOptions({ maxNumFaces: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        setupFaceMesh(fm);
        faceMeshRef.current = fm;
      } catch (_) {}
    })();

    const camera = new Camera(video, {
      onFrame: async () => {
        const v = webcamRef.current?.video;
        if (!v || v.readyState < 2) return;
        try {
          if (poseRef.current) await poseRef.current.send({ image: v });
          if (faceMeshRef.current && !isPausedRef.current)
            await faceMeshRef.current.send({ image: v });
        } catch (_) {}
      },
      width: 640,
      height: 480,
    });
    camera.start();
    cameraRef.current = camera;

    return () => {
      try {
        if (cameraRef.current) cameraRef.current.stop();
      } catch (_) {}
      pose.close();
      try {
        if (faceMeshRef.current) faceMeshRef.current.close();
      } catch (_) {}
      poseRef.current = null;
      faceMeshRef.current = null;
    };
  }, [loading, error, decodedExerciseName, angleRule, logPainIncident]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p>Loading exercise data...</p>
      </div>
    );
  }

  if (error || !decodedExerciseName) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <p className="text-red-400">{error || 'Exercise not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-lg"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold truncate max-w-md">{decodedExerciseName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {isPaused ? (
            <span className="px-3 py-1 bg-red-600 rounded-full text-sm font-semibold">
              Session paused (pain detected)
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-600 rounded-full text-sm">Live</span>
          )}
          <button
            onClick={() => {
              setIsPaused(false);
              setPainDetected(false);
              painFrameCount.current = 0;
            }}
            className="px-3 py-1 bg-blue-600 rounded-lg text-sm hover:bg-blue-500 disabled:opacity-50"
            disabled={!isPaused}
          >
            Resume
          </button>
          <button
            onClick={() => logPainIncident('Simulated pain expression (demo)')}
            className="px-3 py-1 bg-amber-600 rounded-lg text-sm hover:bg-amber-500"
          >
            Simulate pain (demo)
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className="relative flex-1 flex items-center justify-center bg-black">
          <Webcam
            ref={webcamRef}
            className="absolute inset-0 w-full h-full object-contain"
            width={640}
            height={480}
            videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
          />
          {showGoodFormCelebration && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-pulse">
              <div className="bg-emerald-500/90 text-white px-6 py-4 rounded-xl text-xl font-bold shadow-lg ring-2 ring-emerald-300">
                ✓ Good form!
              </div>
            </div>
          )}
        </div>

        <div className="w-96 border-l border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Posture feedback</h2>
            <div
              className={`p-3 rounded-lg ${
                feedback.valid ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
              }`}
            >
              <p>{feedback.message || '—'}</p>
              {feedback.currentAngle != null && (
                <p className="mt-1 font-mono">Angle: {feedback.currentAngle.toFixed(1)}°</p>
              )}
            </div>
            {angleRule && (
              <p className="mt-2 text-xs text-gray-500">
                Rule: {angleRule.startRaw} → {angleRule.endRaw}
              </p>
            )}
          </div>

          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-emerald-400 mb-2">Good form reps</h2>
            <p className="text-3xl font-bold text-emerald-300 tabular-nums">{goodFormRepCount}</p>
            <p className="text-sm text-gray-400 mt-1">
              Hold correct form for ~0.5s to count one rep. Leave form and return to count the next.
            </p>
          </div>

          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-amber-400 mb-2">Pain detection</h2>
            <p className="text-sm text-gray-400">
              Squinting and grimacing are monitored. If pain is detected, the session is paused and an incident is logged.
            </p>
            {painDetected && (
              <p className="mt-2 text-amber-300 text-sm">Pain expression detected — session paused.</p>
            )}
          </div>

          <div className="p-4 flex-1 overflow-auto">
            <h2 className="text-lg font-semibold text-red-400 mb-2">Incident log</h2>
            {incidentLog.length === 0 ? (
              <p className="text-gray-500 text-sm">No incidents recorded.</p>
            ) : (
              <ul className="space-y-2">
                {incidentLog.map((inc, i) => (
                  <li key={i} className="text-sm bg-gray-800 p-2 rounded">
                    <span className="text-gray-500">{inc.time}</span> — {inc.reason}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
