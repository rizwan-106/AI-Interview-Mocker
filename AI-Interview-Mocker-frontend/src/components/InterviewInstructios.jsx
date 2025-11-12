import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  Camera,
  Mic,
  Info,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Webcam from "react-webcam";
import { useSelector } from "react-redux";

const InterviewInstructios = () => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  const {singleInterview} = useSelector(store=>store.interview); 

  const navigate = useNavigate();
  const enableCamera = async () => {
    try {
      setCameraEnabled(true);
      // In real app, you'd request camera permission here
      // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
      console.error("Camera access denied:", error);
      setCameraEnabled(false);
    }
  };

  const params = useParams();

  const startInterview = () => {
    setIsStarting(true);
    setTimeout(() => {
      setIsStarting(false);
      navigate(`/interview/${params.id}/init`);
    },300);


    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 mt-10">
            Let's Get Started
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-10/12 mx-auto">
          <div className="max-w-6xl mx-auto">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Interview Details & Instructions */}
              <div className="space-y-6">
                {/* Interview Summary Card */}
                <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="text-slate-700 font-semibold min-w-0">
                          Job Role/Job Position:
                        </div>
                        <div className="text-slate-600 font-medium">
                          {singleInterview.jobTitle}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-slate-700 font-semibold min-w-0">
                          skills:
                        </div>
                        <div className="text-slate-600 font-medium">
                          {singleInterview.skills}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="text-slate-700 font-semibold min-w-0">
                          Years of Experience:
                        </div>
                        <div className="text-slate-600 font-medium">
                          {singleInterview.experience}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Information Card */}
                <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                          <Info className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-amber-800 mb-3">
                          Information
                        </h3>
                        <p className="text-amber-700 leading-relaxed">
                          Enable Video Web Cam and Microphone to Start your AI
                          Generated Mock Interview. It Has{" "}
                          {singleInterview.questions.length} question which you
                          can answer and at the last you will get the report on
                          the basis of your answer.
                          <span className="font-semibold">
                            NOTE: We never record your video
                          </span>
                          , Web cam access you can disable at any time if you
                          want.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side - Camera Setup & Start Button */}
              <div className="space-y-6">
                {/* Camera Preview Card */}
                <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {cameraEnabled ? (
                        <Webcam
                          className="w-full h-full object-cover rounded-xl"
                          onUserMedia={() => {
                            setCameraEnabled(true);
                          }}
                          onUserMediaError={() => {
                            setCameraEnabled(false);
                          }}
                          mirrored={true}
                        />
                      ) : (
                        <div className="text-center">
                          <Camera className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-500 text-sm">
                            Camera Preview
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Enable Camera Button */}
                <div className="max-w-7/12 mx-auto flex justify-between text-center">
                  <Button
                    onClick={enableCamera}
                    variant={cameraEnabled ? "default" : "outline"}
                    className={`cursor-pointer flex items-center gap-2 px-6 py-3 ${
                      cameraEnabled
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Camera className="h-4 w-4" />
                    {cameraEnabled ? "Camera Enabled" : "Enable Camera"}
                    {cameraEnabled && <CheckCircle className="h-4 w-4" />}
                  </Button>

                  {/* Status Indicator */}
                  <div className="flex justify-center gap-4 text-sm mt-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          cameraEnabled ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                      <span
                        className={
                          cameraEnabled ? "text-emerald-600" : "text-slate-500"
                        }
                      >
                        Camera {cameraEnabled ? "Ready" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Start Interview Button */}
                <div className="text-center">
                  <Button
                    onClick={startInterview}
                    disabled={!cameraEnabled || isStarting}
                    className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-8 py-4 text-lg font-semibold rounded-xl"
                  >
                    {isStarting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Starting Interview...
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-5 w-5 mr-2" />
                        Start Interview
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {!cameraEnabled && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Please enable camera to start the interview
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewInstructios;
