import React from "react";
import { CheckCircle, ArrowRight, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const InterviewEnd = () => {
  const navigate = useNavigate();
  const handleViewDashboard = () => {
    navigate('/dashboard')
  };

  const handleStartNewInterview = () => {
    navigate('/interview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100">
      {/* Header */}

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-md mx-auto px-4">
          <Card className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center space-y-6">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="h-16 w-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Interview Completed!
                </h2>
                <p className="text-slate-600 text-lg">
                  Great job! Your interview has been successfully completed and
                  submitted.
                </p>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-emerald-700">
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">
                    Check your dashboard for detailed results
                  </span>
                </div>
              </div>

              {/* Processing Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Results are being processed and will be available shortly
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleViewDashboard}
                  className="cursor-pointer w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 h-11"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  onClick={handleStartNewInterview}
                  variant="outline"
                  className="cursor-pointer w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 h-11"
                >
                  Start New Interview
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewEnd;
