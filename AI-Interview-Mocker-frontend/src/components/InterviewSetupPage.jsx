import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PlayCircle,
  Target,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
  Loader2,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Shield,
  Mic,
} from "lucide-react";

// *use genAI utility to generate questions*
import genAI from "@/utils/genAi.js";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setQuestions, setSingleInterview } from "@/redux/slices/interviewSlice";
import { VITE_API_BASE_URL } from "@/utils/utils";

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    jobDescription: "",
    skills: "",
    difficulty: "",
    experience: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = `jobTitle: ${formData.jobTitle}, company: ${formData.company}, jobDescription: ${formData.jobDescription}, skills: ${formData.skills}, difficultyLevel: ${formData.difficulty}, experience: ${formData.experience}. Based on this information, generate 10 interview questions in JSON format. The questions should be focused on:
1. Conceptual understanding of ${formData.skills},
2. Scenario-based problem solving,
3. Predicting the output of code snippets,
4. Core data structures and algorithms relevant to the role.
Ensure questions are practical, relevant to the job title and description, and challenge problem-solving and coding logic.generate questions in  JSON format`;

    try {
      setLoading(true);
      const data = await genAI(prompt);
      const questionsArray = data.map((item) => item.question);
      // const answersArray = data.map((item) => item.answer);
      const postData = { ...formData, questions: questionsArray };
      try {
        const res = await axios.post(
          `${VITE_API_BASE_URL}/interview/registerInterview`,
          postData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        // if (res.data.success) {
        if(res.status==='201'|| res.status===201) {
          dispatch((setQuestions(questionsArray)));
          dispatch(setSingleInterview(res.data.interview));
          navigate(`/interview/${res.data.interview.id}`);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong");
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const difficultyLevels = [
    {
      value: "beginner",
      label: "Beginner",
      description: "Basic questions, foundational concepts",
    },
    {
      value: "intermediate",
      label: "Intermediate",
      description: "Moderate complexity, practical scenarios",
    },
    {
      value: "advanced",
      label: "Advanced",
      description: "Complex problems, system design",
    },
    {
      value: "expert",
      label: "Expert",
      description: "Challenging scenarios, leadership questions",
    },
  ];

  const experienceLevels = [
    {
      value: "0-1",
      label: "0-1 Years",
      description: "Fresh graduate or entry level",
    },
    { value: "1-3", label: "1-3 Years", description: "Junior professional" },
    { value: "3-5", label: "3-5 Years", description: "Mid-level professional" },
    { value: "5-8", label: "5-8 Years", description: "Senior professional" },
    { value: "8+", label: "8+ Years", description: "Lead/Principal level" },
  ];

  const features = [
    {
      icon: <MessageSquare className="h-5 w-5 text-emerald-500" />,
      title: "Real-time Questions",
      description: "Dynamic questions based on your profile",
    },
    {
      icon: <Mic className="h-5 w-5 text-teal-500" />,
      title: "Voice Recognition",
      description: "Speak your answers naturally",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-cyan-500" />,
      title: "Instant Feedback",
      description: "Get detailed performance analysis",
    },
    {
      icon: <Shield className="h-5 w-5 text-amber-500" />,
      title: "Secure & Private",
      description: "Your data stays completely private",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-16">
        <div className="max-w-10/12 mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
            Setup Your Interview
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Customize your interview experience by providing job details and
            preferences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-10/12 mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white p-8">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Target className="h-6 w-6 text-emerald-600" />
                    Interview Configuration
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-lg">
                    Fill in the details to get personalized interview questions
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Job Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <Users className="h-5 w-5 text-emerald-600" />
                        Job Information
                      </h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="jobTitle"
                            className="text-slate-700 font-medium"
                          >
                            Job Title *
                          </Label>
                          <Input
                            id="jobTitle"
                            placeholder="e.g., Frontend Developer"
                            value={formData.jobTitle}
                            onChange={(e) =>
                              handleInputChange("jobTitle", e.target.value)
                            }
                            className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-200 bg-slate-50 focus:bg-white"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="company"
                            className="text-slate-700 font-medium"
                          >
                            Company (Optional)
                          </Label>
                          <Input
                            id="company"
                            placeholder="e.g., Google, Microsoft"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-200 bg-slate-50 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="jobDescription"
                          className="text-slate-700 font-medium"
                        >
                          Job Description *
                        </Label>
                        <textarea
                          id="jobDescription"
                          placeholder="Paste the job description here or describe the role requirements..."
                          value={formData.jobDescription}
                          onChange={(e) =>
                            handleInputChange("jobDescription", e.target.value)
                          }
                          className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg transition-all duration-200 bg-slate-50 focus:bg-white min-h-[120px] p-3"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="skills"
                          className="text-slate-700 font-medium"
                        >
                          Key Skills & Technologies *
                        </Label>
                        <Input
                          id="skills"
                          placeholder="e.g., React, JavaScript, Node.js, Python, AWS"
                          value={formData.skills}
                          onChange={(e) =>
                            handleInputChange("skills", e.target.value)
                          }
                          className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-200 bg-slate-50 focus:bg-white"
                          required
                        />
                        <p className="text-sm text-slate-500">
                          Separate multiple skills with commas
                        </p>
                      </div>
                    </div>

                    {/* Difficulty Level */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-emerald-600" />
                        Difficulty Level *
                      </h3>

                      <RadioGroup
                        value={formData.difficulty}
                        onValueChange={(value) =>
                          handleInputChange("difficulty", value)
                        }
                        className="grid md:grid-cols-2 gap-4"
                      >
                        {difficultyLevels.map((level) => (
                          <div
                            key={level.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={level.value}
                              id={level.value}
                            />
                            <Label
                              htmlFor={level.value}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all duration-200">
                                <div className="font-medium text-slate-700">
                                  {level.label}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {level.description}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        Experience Level *
                      </h3>

                      <RadioGroup
                        value={formData.experience}
                        onValueChange={(value) =>
                          handleInputChange("experience", value)
                        }
                        className="grid md:grid-cols-2 gap-4"
                      >
                        {experienceLevels.map((level) => (
                          <div
                            key={level.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={level.value}
                              id={level.value}
                            />
                            <Label
                              htmlFor={level.value}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all duration-200">
                                <div className="font-medium text-slate-700">
                                  {level.label}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {level.description}
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    {/* Interview Duration */}
                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-200">
                      <Button
                        disabled={
                          loading ||
                          !formData.jobTitle ||
                          !formData.jobDescription ||
                          !formData.skills ||
                          !formData.difficulty ||
                          !formData.experience
                        }
                        className="cursor-pointer w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 h-12 text-lg font-semibold"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Preparing Interview...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-5 w-5 mr-2" />
                            Start Interview
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            {/* Features Sidebar */}
            <div className="space-y-6">
              <Card className="bg-white border border-slate-200 rounded-2xl shadow-lg">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    >
                      <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                      <div>
                        <h4 className="font-medium text-slate-700">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-semibold">Pro Tips</h3>
                    <ul className="text-sm text-emerald-100 space-y-2 text-left">
                      <li>• Be specific about your skills and experience</li>
                      <li>
                        • Choose difficulty level that matches your target role
                      </li>
                      <li>
                        • Review job description thoroughly before starting
                      </li>
                      <li>• Find a quiet environment for the interview</li>
                    </ul>
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
export default InterviewSetupPage;

