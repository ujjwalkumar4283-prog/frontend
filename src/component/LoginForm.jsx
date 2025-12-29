import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/userSlice";
import anime from "../asset/anime.jpeg"

function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND}/user/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // cookies
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      console.log("Login Response:", data);

      if (data.status === 200) {
        dispatch(login(data.data)); // ✅ store.user update
        onClose(); // close popup
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login error, check console");
    }
  };


return (
  <div
    className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
    style={{ backgroundImage: `url(${anime})` }}
  >
    <div className="bg-gray-400 w-11/12 max-w-md rounded-xl p-4 relative shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-xl font-bold text-white"
      >
        ✖
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="text-white font-medium">Email</label>
        <input
          type="email"
          className="px-2 py-1 rounded-xl bg-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-white font-medium">Password</label>
        <input
          type="password"
          className="px-2 py-1 rounded-xl bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-green-500 text-white rounded-xl py-2 mt-2 hover:bg-green-600 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
);

}

export default LoginForm;
