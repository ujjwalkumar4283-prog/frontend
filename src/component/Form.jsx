import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { setAssign } from "../store/AssignmentSlice";



function Form() {
  const user = useSelector((state) => state.user.user); // logged-in user
  const [sr, setSr] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch()

  // Only admin sees this form
  if (!user || user.email !== "admin@admin.com") {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sr || !name) {
      alert("Serial number and name are required");
      return;
    }

    const assignmentData = {
      serialNumber: sr,
      name: name,
    };

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND}/assignment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // send cookies
        body: JSON.stringify(assignmentData),
      });

      const data = await res.json();
      console.log("Assignment created:", data);
      alert("Assignment created successfully!");
      setSr("");
      setName("");


    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment");
    } finally {

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






      setLoading(false);

    }
  };

  return (
    <div className="bg-yellow-200 p-6 rounded-xl shadow-md max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Assignment</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="flex flex-col flex-1">
            <label className="font-semibold text-gray-700">Serial Number</label>
            <input
              type="number"
              placeholder="Enter serial number"
              className="bg-white p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sr}
              onChange={(e) => setSr(e.target.value)}
            />
          </div>

          <div className="flex flex-col flex-1">
            <label className="font-semibold text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="bg-white p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Assignment"}
        </button>
      </form>
    </div>
  );
}

export default Form;
