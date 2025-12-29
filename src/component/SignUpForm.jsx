import { useState } from "react";
import anime from "../asset/anime.jpeg"

function SignUpForm({ onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, email, password };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();
      console.log("Success:", data);

      onClose(); // signup ke baad popup close
    } catch (error) {
      console.error("Error:", error);
    }
  };


return (
  <div
    className="fixed inset-0 flex justify-center items-center bg-cover bg-center"
    style={{ backgroundImage: `url(${anime})` }}
  >
    <div className="bg-gray-400 w-11/12 max-w-md rounded-xl p-4 relative shadow-lg">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-xl font-bold text-white"
      >
        ✖
      </button>

      <h2 className="text-xl font-bold text-center mb-2 text-white">
        Sign Up
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label className="text-white font-medium">Name</label>
        <input
          type="text"
          className="px-2 py-1 rounded-xl bg-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Sign Up
        </button>
      </form>
    </div>
  </div>
);

}

export default SignUpForm;
