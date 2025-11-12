import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PlayCircle,
  MessageSquare,
  TrendingUp,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Mic,
  BarChart3,
  Target,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import usegetAllUserInterviews from "@/hooks/usegetAllUserInterviews";

const Home = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Real-Time Questions",
      description:
        "Get industry-relevant questions tailored to your field and experience level.",
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Recording",
      description:
        "Record your answers naturally and get analyzed just like a real interview.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced AI analyzes your responses for clarity, confidence, and content quality.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Detailed Feedback",
      description:
        "Receive comprehensive feedback with ratings and improvement suggestions.",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Progress Tracking",
      description:
        "Monitor your improvement over time with detailed analytics and insights.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description:
        "Your practice sessions and data are completely secure and confidential.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content:
        "InterviewMocker helped me land my dream job at a top tech company. The AI feedback was incredibly accurate!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content:
        "The real-time analysis and detailed feedback improved my interview skills dramatically. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Marketing Specialist",
      content:
        "Perfect practice platform! The questions were spot-on and the feedback helped me identify my weak points.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10,000+", label: "Practice Sessions" },
    { number: "95%", label: "Success Rate" },
    { number: "500+", label: "Happy Users" },
    { number: "4.9/5", label: "Average Rating" },
  ];
  
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const {user} = useSelector(store=>store.auth)
    usegetAllUserInterviews(user);
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-10/12 mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              🚀 AI-Powered Interview Practice
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Master Your Next
              <span className="block bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Interview
              </span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-emerald-100 max-w-3xl mx-auto">
              Practice with real-time questions, record your answers, and get
              AI-powered feedback to ace your interviews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to={"/interview"}>
                <Button
                  size="lg"
                  className="cursor-pointer bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Start Practice Now
                </Button>
              </NavLink>
              <Button
               
               onClick={scrollToSection}
                size="lg"
                variant="outline"
                className=" cursor-pointer border-white/30 text-yellow-500 hover:bg-white/10 font-semibold px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
              >
                How It Works
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-10/12 mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-10/12 mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
              ✨ Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Everything You Need to
              <span className="text-emerald-600"> Succeed</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to
              prepare for your interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-slate-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={sectionRef} className="py-20 bg-white">
        <div className="max-w-10/12 mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-teal-100 text-teal-700 border-teal-200">
              🎯 Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple 4-step process to improve your interview skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description:
                  "Create your account and choose your interview type",
              },
              {
                step: "2",
                title: "Practice",
                description:
                  "Answer real-time questions while recording your responses",
              },
              {
                step: "3",
                title: "Analyze",
                description:
                  "AI analyzes your answers for content, clarity, and confidence",
              },
              {
                step: "4",
                title: "Improve",
                description:
                  "Get detailed feedback and track your progress over time",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-10/12 mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200">
              💬 Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of successful candidates who improved their
              interview skills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-slate-200 bg-white hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <CardTitle className="text-slate-800">
                    {testimonial.name}
                  </CardTitle>
                  <p className="text-emerald-600 font-medium">
                    {testimonial.role}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of candidates who have improved their interview
            skills with InterviewMocker
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                navigate("/interview");
              }}
              size="lg"
              className=" cursor-pointer bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
