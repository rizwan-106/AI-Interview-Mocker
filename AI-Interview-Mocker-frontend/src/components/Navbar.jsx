import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarImage } from "./ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "@/utils/utils";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/slices/authSlice";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/user/logout`,{}, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-200/60 backdrop-blur-sm">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <div>
          <NavLink to="/" onClick={closeMobileMenu}>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Interview
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Mocker
              </span>
            </h1>
          </NavLink>
        </div>

        {/* Desktop Navigation - Now shows on sm and above */}
        <div className="hidden sm:flex items-center">
          {!user ? (
            <div className="flex items-center gap-2">
              <NavLink to="/login">
                <Button
                  variant="outline"
                  className="cursor-pointer border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                >
                  Login
                </Button>
              </NavLink>

              <NavLink to="/signup">
                <Button className="cursor-pointer  bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Signup
                </Button>
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink to="/dashboard">
                <Button
                  variant="outline"
                  className="cursor-pointer border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                >
                  Dashboard
                </Button>
              </NavLink>

              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer h-10 w-10 ring-2 ring-emerald-200 hover:ring-emerald-300 transition-all duration-200">
                    <AvatarImage
                      src={user?.profile.profilePhoto}
                      alt="@shadcn"
                    />
                  </Avatar>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-4 bg-white/95 backdrop-blur-md border-emerald-200/60 shadow-xl">
                  <div>
                    <div className="flex gap-2 space-y-2 items-start">
                      <Avatar className="h-10 w-10 ring-2 ring-emerald-200">
                        <AvatarImage
                          src={user?.profile.profilePhoto}
                          alt="@shadcn"
                        />
                      </Avatar>

                      <div>
                        <h4 className="font-medium text-slate-800">
                          {user?.fullname}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {user?.profile.bio}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col my-2 mt-2 text-slate-600 gap-4">
                      <div className="flex w-fit items-center gap-6 cursor-pointer group">
                        <User2 className="text-emerald-500 group-hover:text-emerald-600 transition-colors duration-200" />
                        <Button
                          onClick={() => {
                            navigate("/profile");
                          }}
                          variant="link"
                          className="cursor-pointer p-0 h-auto text-slate-700 hover:text-emerald-600 transition-colors duration-200"
                        >
                          View Profile
                        </Button>
                      </div>

                      <div className="flex w-fit items-center gap-6 cursor-pointer group">
                        <LogOut className="text-amber-500 group-hover:text-amber-600 transition-colors duration-200" />
                        <Button
                          onClick={logoutHandler}
                          variant="link"
                          className="cursor-pointer p-0 h-auto text-slate-700 hover:text-amber-600 transition-colors duration-200"
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Now shows only on screens smaller than sm */}
        <div className="sm:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="cursor-pointer  text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Now shows only on screens smaller than sm */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200/60 backdrop-blur-sm">
          <div className="px-4 py-4 space-y-4">
            {!user ? (
              <div className="flex flex-col gap-3">
                <NavLink to="/login" onClick={closeMobileMenu}>
                  <Button
                    variant="outline"
                    className="cursor-pointer w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                  >
                    Login
                  </Button>
                </NavLink>

                <NavLink to="/signup" onClick={closeMobileMenu}>
                  <Button className="cursor-pointer w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    Signup
                  </Button>
                </NavLink>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-emerald-200/60">
                  <Avatar className="h-12 w-12 ring-2 ring-emerald-200">
                    <AvatarImage
                      src={user?.profile.profilePhoto}
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800 text-sm">
                      {user?.fullname}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {user?.profile.bio}
                    </p>
                  </div>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  <NavLink to="/dashboard" onClick={closeMobileMenu}>
                    <Button
                      variant="outline"
                      className="cursor-pointer mb-2 w-full justify-start border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                    >
                      Dashboard
                    </Button>
                  </NavLink>

                  <Button
                    onClick={() => {
                      navigate("/profile");
                      closeMobileMenu();
                    }}
                    variant="outline"
                    className="cursor-pointer w-full justify-start border-emerald-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200"
                  >
                    <User2 className="mr-2 h-4 w-4 text-emerald-500" />
                    View Profile
                  </Button>

                  <Button
                    onClick={() => {
                      logoutHandler();
                      closeMobileMenu();
                    }}
                    variant="outline"
                    className="cursor-pointer w-full justify-start border-amber-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 transition-all duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-amber-500" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
