import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import logo from "./asset/logo.png";
import ujjawal from "./asset/ujjawal.jpeg";

import LoginForm from "./component/LoginForm";
import SignUpForm from "./component/SignUpForm";
import Display from "./component/Display";
import Form from "./component/Form";
import SubjectTabs from "./component/SubjectTabs";
import { setAssign } from "./store/AssignmentSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.status);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Refresh user
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}/user/refreshAccessToken`,
          { method: "POST", credentials: "include" }
        );
        const data = await res.json();
        if (data.status === 200 && data.data) {
          dispatch({ type: "user/login", payload: data.data });
        }
      } catch (err) {
        console.error("Refresh token failed", err);
      }
    };
    refreshUser();
  }, [dispatch]);

  // 🚀 Fetch all assignments initially (Option 1)
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchAllAssignments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}/assignment/get-all-assignment`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.status === 200) dispatch(setAssign(data.data));
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      }
    };

    fetchAllAssignments();
  }, [isLoggedIn, dispatch]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    }
    dispatch({ type: "user/logout" });
  };

  return (
    <BrowserRouter>
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-between items-center h-16">
            <li className="flex items-center gap-2">
              <img src={logo} alt="logo" className="w-12 h-12 rounded-full border-2 border-white"/>
              <span className="text-white font-semibold text-lg max-md:hidden">
                Assignment App
              </span>
            </li>

            <li className="text-white text-2xl font-bold">Dashboard</li>

            <li className="flex gap-3">
              {!isLoggedIn ? (
                <>
                  <button onClick={() => setShowSignUp(true)} className="px-4 py-1.5 rounded-full bg-red-500 text-white">
                    Sign Up
                  </button>
                  <button onClick={() => setShowLogin(true)} className="px-4 py-1.5 rounded-full bg-green-500 text-white">
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <span className="text-white">{user?.name || user?.email}</span>
                  <button onClick={handleLogout} className="px-4 py-1.5 rounded-full bg-gray-600 text-white">
                    Logout
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      </header>

      {/* ADMIN FORM */}
      {isLoggedIn && user?.email === "admin@admin.com" && <Form />}

      {/* MAIN */}
      <main className="bg-gray-100 min-h-screen p-4">
        {!isLoggedIn ? (
          <div>
            <div className="text-center mt-5">
              <h1 className="text-3xl font-bold text-gray-700 mb-2">
                Welcome 👋
              </h1>
              <p className="text-gray-600">Please Sign In or Sign Up to continue</p>
            </div>
            <div className="flex justify-center mt-4 rounded-full">
              <img src={ujjawal} alt="Welcome" className="w-64 h-auto rounded-full" />
            </div>
            <div className="text-center mt-5">
              <h1 className="text-3xl font-bold text-gray-700 mb-2">
                Designed and Developed by
              </h1>
              <p className="text-blue-600 font-bold italic"> <u>Ujjawal Agrawal</u> <span className="font-bold text-red-600">(E1J1)</span></p>
            </div>
          </div>
        ) : (
          <>
            <SubjectTabs />
            <Routes>
              <Route path="/" element={<Navigate to="/assignments/subject1" />} />
              <Route path="/assignments/:subject" element={<Display />} />
            </Routes>
          </>
        )}
      </main>

      {/* POPUPS */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}
    </BrowserRouter>
  );
}

export default App;
