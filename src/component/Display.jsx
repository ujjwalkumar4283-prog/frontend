import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updateAssignment, setAssign } from "../store/AssignmentSlice";

function Display() {
  const { subject } = useParams();
  const dispatch = useDispatch();
  const allAssignments = useSelector((state) => state.assignment.assignment);
  const user = useSelector((state) => state.user.user);

  // Filter only current subject
  const assignments = allAssignments.filter((a) => a.subject === subject);

  // Fetch all assignments from backend
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

  const handleCheckboxChange = async (serialNumber, field, value) => {
    // 1️⃣ Optimistic UI update
    dispatch(updateAssignment({ serialNumber, field, value }));

    // 2️⃣ Backend update
    try {
      await fetch(`${import.meta.env.VITE_BACKEND}/assignment/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serialNumber, subject, [field]: value }),
      });
    } catch (err) {
      console.error("Update failed", err);
    }

    // 3️⃣ Optional: sync all assignments to keep Redux consistent
    fetchAllAssignments();
  };

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <h2 className="text-xl font-bold mb-4">{subject?.toUpperCase()}</h2>

      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th>Serial</th>
            <th>Name</th>
            {[1, 2, 3, 4, 5].map((n) => (
              <th key={n}>Assignment {n}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {assignments.map((item) => (
            <tr key={item._id} className="text-center border-b">
              <td>{item.serialNumber}</td>
              <td>{item.name}</td>
              {[1, 2, 3, 4, 5].map((n) => {
                const field = `assignment${n}`;
                return (
                  <td key={field}>
                    {/* <input
                      type="checkbox"
                      checked={!!item[field]}
                      disabled={user.email !== "admin@admin.com"}
                      onChange={(e) =>
                        handleCheckboxChange(
                          item.serialNumber,
                          field,
                          e.target.checked
                        )
                      }
                    /> */}
                    <input
  type="checkbox"
  checked={!!item[field]}
  disabled={user.email !== "admin@admin.com"}
  onChange={(e) =>
    handleCheckboxChange(
      item.serialNumber,
      field,
      e.target.checked
    )
  }
  style={{
    accentColor: user.email !== "admin@admin.com" ? "green" : undefined,
    opacity: 1,
    cursor: user.email !== "admin@admin.com" ? "not-allowed" : "pointer"
  }}
/>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Display;
