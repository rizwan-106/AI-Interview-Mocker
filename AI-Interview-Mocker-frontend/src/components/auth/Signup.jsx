import { Loader2, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { API_BASE_URL } from "@/utils/utils";



const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    file: "",
  });

  function changeEventHandler(e) {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  function changeFileHandler(e) {
    setInput({ ...input, file: e.target.files?.[0] });
  }

  async function submitHandler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);

    if (input.file) {
      formData.append("profile", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/user/signup`, formData, {
        headers: { "Content-Type": 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.status === 201) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 pt-20 pb-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Form Container with Header Inside */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-emerald-100">Join InterviewMocker today</p>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={submitHandler} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <Label className="text-slate-700 font-medium text-sm">
                  Full Name<sup className="text-red-500 mt-3">*</sup>
                </Label>
                <Input
                  required
                  type="text"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  placeholder="Enter your full name"
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Email Address<sup className="text-red-500 mt-3">*</sup>
                </Label>
                <Input
                  required
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  placeholder="Enter your email"
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Phone Number<sup className="text-red-500 mt-3">*</sup>
                </Label>
                <Input
                  required
                  type="text"
                  value={input.phoneNumber}
                  name="phoneNumber"
                  onChange={changeEventHandler}
                  placeholder="Enter your phone number"
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-200 bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Password<sup className="text-red-500 mt-3">*</sup>
                </Label>
                <div className="relative">
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    value={input.password}
                    name="password"
                    onChange={changeEventHandler}
                    placeholder="Create a strong password"
                    className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-11 transition-all duration-200 bg-slate-50 focus:bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Profile Picture */}
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium text-sm">
                  Profile Picture<sup className="text-red-500 mt-3">*</sup>
                </Label>

                <Input
                  required
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-lg h-10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all duration-200 bg-slate-50"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                {loading ? (
                  <Button
                    disabled
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium shadow-lg opacity-75 cursor-not-allowed"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
                  >
                    Create Account
                  </Button>
                )}
              </div>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-slate-200">
                <span className="text-slate-600 text-sm">
                  Already have an account?{" "}
                  <NavLink
                    to="/login"
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200 hover:underline"
                  >
                    Sign In
                  </NavLink>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;