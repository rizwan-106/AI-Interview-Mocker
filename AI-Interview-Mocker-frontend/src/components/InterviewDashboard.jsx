import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Building,
  Star,
  ArrowRight,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
// Import the hook to fetch user interviews
import usegetAllUserInterviews from "@/hooks/usegetAllUserInterviews";

const InterviewDashboard = () => {
  const navigate = useNavigate();
  const { allUserInterviews } = useSelector(store => store.interview);

  // Call the hook to fetch user-specific interviews when component mounts
  usegetAllUserInterviews();

  const calculateOverallRating = (results) => {
    // Check if results array is empty or undefined
    if (!results || results.length === 0) {
      return 0;
    }
    
    // Filter out invalid ratings and calculate total
    const validRatings = results.filter(result => 
      result && result.rating && !isNaN(result.rating)
    );
    
    // If no valid ratings found, return 0
    if (validRatings.length === 0) {
      return 0;
    }
    
    const totalRating = validRatings.reduce((sum, result) => sum + result.rating, 0);
    return Math.round(totalRating / validRatings.length);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "hard":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-emerald-600";
    if (rating >= 6) return "text-amber-600";
    return "text-orange-600";
  };

  const handleCardClick = (interviewId) => {
    navigate(`/dashboard/${interviewId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100">

      {/* Main Content */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Interview Dashboard
            </h2>
            <p className="text-slate-600">
              Track your interview progress and performance
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Total Interviews</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {allUserInterviews.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Average Rating</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {allUserInterviews.length > 0 ? Math.round(
                        allUserInterviews.reduce(
                          (sum, interview) =>
                            sum + calculateOverallRating(interview.results),
                          0
                        ) / allUserInterviews.length
                      ) : 0}
                      /10
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">This Month</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {allUserInterviews.length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Cards */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-800">
              Recent Interviews
            </h3>
            <div className="grid gap-6">
              {allUserInterviews.map((interview) => (

                <Card
                  key={interview.id}
                  className="bg-white border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => handleCardClick(interview.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-semibold text-slate-800">
                            {interview.jobTitle}
                          </h4>
                          <Badge
                            className={getDifficultyColor(interview.difficulty)}
                          >
                            {interview.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600 mb-2">
                          <Building className="h-4 w-4" />
                          <span>{interview.company}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                          {interview.jobDescription}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(interview.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{interview.results.length} Questions</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          <Star
                            className={`h-5 w-5 ${getRatingColor(
                              calculateOverallRating(interview.results)
                            )}`}
                          />
                          <span
                            className={`text-lg font-semibold ${getRatingColor(
                              calculateOverallRating(interview.results)
                            )}`}
                          >
                            {calculateOverallRating(interview.results)}/10
                          </span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Skills:</span>{" "}
                          {interview.skills.split(",").slice(0, 3).join(", ")}
                          {interview.skills.split(",").length > 3 && "..."}
                        </div>
                        <div className="text-sm text-slate-600">
                          {interview.experience} experience
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {allUserInterviews.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No interviews yet
              </h3>
              <p className="text-slate-500 mb-6">
                Start your first interview to see your progress here
              </p>
              <Button className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                Start Interview
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewDashboard;
