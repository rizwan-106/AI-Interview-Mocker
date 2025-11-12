import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Square,
  Play,
  SkipForward,
  Clock,
  User,
  Info,
  CheckCircle2,
  Circle,
  Volume2,
  VolumeOff,
} from "lucide-react";

import useSpeechToText from "react-hook-speech-to-text";

import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import genAI from "@/utils/genAi";
import { useNavigate, useParams } from "react-router-dom";
import { VITE_API_BASE_URL, VITE_EYE_FACE_BE_API } from "@/utils/utils";
import axios from "axios";
import { setInterviewResult } from "@/redux/slices/interviewSlice";
import usegetAllUserInterviews from "@/hooks/usegetAllUserInterviews";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

const InterviewActivePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [userAnswer, setUserAnswer] = useState("");
  const [volOn, setVolOn] = useState(false);
  const [processedResultsCount, setProcessedResultsCount] = useState(0); // Track processed results

  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [intResult, setIntResult] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    clearResults, // Add this if available in your hook
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const saveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
    HandleClick();
  };

  // Process only new results to avoid accumulation
  useEffect(() => {
    if (results.length > processedResultsCount) {
      const newResults = results.slice(processedResultsCount);
      newResults.forEach((result) => {
        setUserAnswer((prev) => prev + result.transcript);
      });
      setProcessedResultsCount(results.length);
    }
  }, [results, processedResultsCount]);

  const gettingFeedback = async () => {

    const prompt = `question: ${questions[currentQuestion]}, answer: ${userAnswer}. Based on question and answer given in an interview. give a rating on scale 1 to 10 (Be strict while rating.) and also give an honest feedback in 3-4 lines.act like you are taking the interview. give response in json format and "rating" and "feedback" as a field in json resonse`;
    const feed = await genAI(prompt);

    setIntResult((prev) => [
      ...prev,
      {
        question: questions[currentQuestion],
        answer: userAnswer,
        rating: Number(feed.rating),
        feedback: feed.feedback,
      },
    ]);

    // Mark this question as answered
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion]));

    // Clear everything for next question
    clearCurrentAnswer();
  };

  // Function to clear current answer and reset counters
  const clearCurrentAnswer = () => {
    setUserAnswer("");
    // setProcessedResultsCount(0);
    // Clear results if the hook provides this method
    if (clearResults) {
      clearResults();
    }
  };

  // Only trigger feedback when recording stops and there's a valid answer
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      gettingFeedback();
    }
  }, [isRecording]);

  // Mock questions data
  const { questions } = useSelector((store) => store.interview);

  // Timer effect for overall interview
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      // Clear answer and reset counters when moving to next question
      clearCurrentAnswer();
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const selectQuestion = (index) => {
    // Clear answer and reset counters when selecting a different question
    clearCurrentAnswer();
    setCurrentQuestion(index);
  };

  const textToSpeech = async (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      if (synth.speaking) {
        synth.cancel();
        setVolOn(false);
      } else {
        const speech = new SpeechSynthesisUtterance(text);
        speech.onend = () => setVolOn(false);
        synth.speak(speech);
        setVolOn(true);
      }
    } else {
      alert(`Your browser doesn't support text to speech.`);
    }
  };

  const finishInterview = async () => {

    try {
      const res = await axios.post(
        `${VITE_API_BASE_URL}/interview/updateFeedbackAndRating`,
        { interviewId: params.id, intResult },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      if (res.data.success) {
        dispatch(setInterviewResult(res.data.interview))
        navigate(`/interview/${params.id}/end`);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('something went wrong....')

    }

  };

  const { interviewResult } = useSelector((store) => store.interview);

  usegetAllUserInterviews(interviewResult);

  //*************************** Detection*********************************** */

  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const intervalRef = useRef(null);

  const [analysis, setAnalysis] = useState({
    face_detected: false,
    face_count: 0,
    focused: false,
  });

  const [focusedFrames, setFocusedFrames] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [focusPercent, setFocusPercent] = useState(0);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [lastWarning, setLastWarning] = useState("");

  const handleStartRecording = () => {
    if (recordingStarted) return;

    socketRef.current = io(
      // "https://eye-face-detection-microservice.onrender.com"
      VITE_EYE_FACE_BE_API);

    setFocusedFrames(0);
    setTotalFrames(0);
    setFocusPercent(0);
    setLastWarning("");

    setRecordingStarted(true);

    // Emit frames every 500ms
    intervalRef.current = setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc && socketRef.current) {
          socketRef.current.emit("frame", { image: imageSrc });
        }
      }
    }, 500);

    // Listen for analysis
    socketRef.current.on("analysis", (data) => {
      setAnalysis(data);
      setTotalFrames((prev) => prev + 1);
      if (data.focused) {
        setFocusedFrames((prev) => prev + 1);
      }

      const currentFocusPercent =
        ((focusedFrames + (data.focused ? 1 : 0)) / (totalFrames + 1)) * 100;

      let warning = "";

      if (data.face_count > 1) {
        warning =
          "⚠️ Multiple faces detected! Only one person should be visible.";
      } else if (!data.face_detected) {
        warning =
          "⚠️ No face detected! Please stay visible in front of the camera.";
      } else if (!data.focused) {
        warning = "⚠️ You seem distracted. Please stay focused.";
      } else if (currentFocusPercent < 60 && totalFrames > 8) {
        warning =
          "⚠️ Your focus is too low. Pay attention to the interview.";
      }

      if (warning && warning !== lastWarning) {
        toast.warn(warning);
        setLastWarning(warning);
      }

      if (!warning) setLastWarning("");
    });

  };

  const handleStopRecording = () => {
    if (!recordingStarted) return;

    setFocusedFrames(0);
    setTotalFrames(0);
    setFocusPercent(0);

    // Clear intervals and socket
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setRecordingStarted(false);
  };

  const HandleClick = async () => {
    if (recordingStarted) {
      handleStopRecording();
    }
    else {
      handleStartRecording();
    }
  }

  // Update focus percentage
  useEffect(() => {
    if (totalFrames > 0) {
      const percent = ((focusedFrames / totalFrames) * 100).toFixed(2);
      setFocusPercent(Number(percent));
    }
  }, [focusedFrames, totalFrames]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100">
      <ToastContainer />
      {/* Header with Timer */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            <span className="text-amber-300"></span>
          </h1>

          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-emerald-200">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            {/* Left Side - Questions */}
            <div className="space-y-6 flex flex-col">
              {/* Question Navigation */}
              <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {questions.map((_, index) => (
                      <Button
                        key={index}
                        onClick={() => selectQuestion(index)}
                        variant={
                          currentQuestion === index ? "default" : "outline"
                        }
                        className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${currentQuestion === index
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                          : answeredQuestions.has(index)
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {answeredQuestions.has(index) ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                          Q{index + 1}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Question */}
              <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg flex-1">
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">
                      Question {currentQuestion + 1}
                    </Badge>
                    <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
                      {questions[currentQuestion]}
                    </h2>
                  </div>

                  <div
                    className="mt-5 cursor-pointer p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200 shadow-md text-gray-700"
                    onClick={() => {
                      textToSpeech(questions[currentQuestion]);
                    }}
                  >
                    {volOn ? (
                      <Volume2 className="w-8 h-8 text-green-600 mx-auto" />
                    ) : (
                      <VolumeOff className="w-8 h-8 text-red-500 mx-auto" />
                    )}
                  </div>

                  {/* Instructions */}
                  <div className="mt-auto">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-1">
                            Note:
                          </h4>
                          <p className="text-blue-700 text-sm leading-relaxed">
                            Click on Record Answer when you want to answer the
                            question. At the end of interview we will give you
                            the feedback along with correct answer for each of
                            question and your answer to compare it.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Recording Area */}
            <div className="space-y-6 flex flex-col">
              {/* Camera/Recording Area */}
              <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg flex-1">
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Camera Preview - Much Larger */}
                  <div className="flex-1 bg-black rounded-xl overflow-hidden mb-6 flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                      {cameraEnabled ? (
                        <div className="relative w-full h-full">
                          <Webcam
                            className="w-full h-full object-cover rounded-xl"
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            onUserMedia={() => {
                              setCameraEnabled(true);
                            }}
                            onUserMediaError={() => {
                              setCameraEnabled(false);
                            }}
                            mirrored={true}
                          />
                          <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                            🎯 Focus: {focusPercent}%
                          </div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mb-6 mx-auto">
                          <User className="h-16 w-16 text-slate-400" />
                        </div>
                      )}

                      <p className="text-slate-400 text-lg">Camera Preview</p>
                    </div>
                  </div>

                  {/* Recording Controls */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <Button
                        onClick={saveUserAnswer}
                        className={`cursor-pointer px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${isRecording
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-lg transform hover:scale-105"
                          : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                          }`}
                      >
                        {isRecording ? (
                          <>
                            <Square className="h-5 w-5 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Record Answer
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Recording Status */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div
                          className={`w-2 h-2 rounded-full ${isRecording
                            ? "bg-red-500 animate-pulse"
                            : "bg-slate-300"
                            }`}
                        />
                        <span
                          className={
                            isRecording
                              ? "text-red-600 font-medium"
                              : "text-slate-500"
                          }
                        >
                          {isRecording ? "Recording..." : "Ready to record"}
                        </span>
                      </div>
                    </div>

                    {/* Show current answer for debugging */}
                    {userAnswer && (
                      <div className="text-center">
                        <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                          Current Answer: {userAnswer}
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <Button
                        onClick={nextQuestion}
                        disabled={currentQuestion >= questions.length - 1}
                        variant="outline"
                        className="cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SkipForward className="h-4 w-4 mr-2" />
                        Next Question
                      </Button>

                      {currentQuestion === questions.length - 1 && (
                        <Button
                          onClick={finishInterview}
                          className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        >
                          Finish Interview
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary - More Compact */}
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold text-emerald-600">
                        {answeredQuestions.size} / {questions.length}
                      </div>
                      <div className="text-emerald-700 text-sm">
                        Questions Answered
                      </div>
                    </div>
                    <div className="w-24 bg-emerald-100 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(answeredQuestions.size / questions.length) * 100
                            }%`,
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewActivePage;
