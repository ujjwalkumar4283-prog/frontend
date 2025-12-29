import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from "./asset/logo.png";
import LoginForm from "./component/LoginForm";
import SignUpForm from "./component/SignUpForm";
import { setAssign } from "./store/AssignmentSlice";
import Display from "./component/Display";
import Form from "./component/Form";
import ujjawal from "./asset/ujjawal.jpeg"

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.status);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Refresh token / fetch user on page load
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}/user/refreshAccessToken`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.status === 200 && data.data) {
          dispatch({ type: "user/login", payload: data.data });
        }
      } catch (error) {
        console.error("Failed to refresh user", error);
      }
    };

    refreshUser();
  }, [dispatch]);

  // fetch assignments after login
  useEffect(() => {
    if (isLoggedIn) {
      const fetchAssignments = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND}/assignment/get-all-assignment`,
            {
              credentials: "include", // cookies
            }
          );
          const data = await res.json();
          if (data.status === 200) {
            dispatch(setAssign(data.data));
          }
        } catch (error) {
          console.error("Failed to fetch assignments", error);
        }
      };
      fetchAssignments();
    }
  }, [isLoggedIn, dispatch]);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API failed", error);
    }
    dispatch({ type: "user/logout" }); // clear store
  };

  return (
    <>
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-between items-center h-16">
            <li className="flex items-center gap-2">
              <img
                src={logo}
                alt="logo"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <span className="text-white font-semibold text-lg max-md:hidden">
                Assignment App
              </span>
            </li>
            <li className="text-white text-2xl font-bold tracking-wide">
              Dashboard
            </li>
            <li className="flex gap-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => setShowSignUp(true)}
                    className="px-4 py-1.5 rounded-full text-white font-medium bg-red-500 hover:bg-red-600 transition duration-200 shadow-md"
                  >
                    Sign Up
                  </button>

                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-4 py-1.5 rounded-full text-white font-medium bg-green-500 hover:bg-green-600 transition duration-200 shadow-md"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <span className="text-white font-medium px-2">
                    {user?.name || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 rounded-full text-white font-medium bg-gray-600 hover:bg-gray-700 transition duration-200 shadow-md"
                  >
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

      {/* MAIN CONTENT */}
      <main className="min-h-[calc(100vh-64px)] bg-gray-100 p-4">
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
          <Display />
        )}
      </main>

      {/* POPUPS */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showSignUp && <SignUpForm onClose={() => setShowSignUp(false)} />}
    </>
  );
}

export default App;
