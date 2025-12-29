// import { useSelector } from "react-redux";

// function Display() {
//   const data = useSelector((state) => state.assignment.assignment); // array of objects
//   const user = useSelector((state) => state.user); // assume yahan current user ka info hai

//   return (
//     <div className="overflow-x-auto mt-6 p-4">
//       <table className="min-w-full bg-white rounded-xl shadow-md">
//         <thead className="bg-blue-600 text-white">
//           <tr>
//             <th className="py-2 px-4">Serial</th>
//             <th className="py-2 px-4">Name</th>
//             <th className="py-2 px-4">Assignment 1</th>
//             <th className="py-2 px-4">Assignment 2</th>
//             <th className="py-2 px-4">Assignment 3</th>
//             <th className="py-2 px-4">Assignment 4</th>
//             <th className="py-2 px-4">Assignment 5</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <tr key={item._id} className="text-center border-b">
//               <td className="py-2 px-4">{item.serialNumber}</td>
//               <td className="py-2 px-4">{item.name}</td>
//               {[1, 2, 3, 4, 5].map((num) => {
//                 const field = `assignment${num}`;
//                 return (
//                   <td className="py-2 px-4" key={field}>
//                     <input
//                       type="checkbox"
//                       checked={item[field]}
//                       disabled={user.name !== "admin"} // sirf admin click kar sakta hai
//                       readOnly={user.name !== "admin"}
//                     />
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Display;



import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateAssignment } from "../store/AssignmentSlice";

function Display() {
  const assignmentsFromStore = useSelector(
    (state) => state.assignment.assignment
  );
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // Local state to reflect checkbox changes immediately
  const [assignments, setAssignments] = useState([]);

  // Sync local state with Redux store initially
  useEffect(() => {
    setAssignments(assignmentsFromStore);
  }, [assignmentsFromStore]);

  const handleCheckboxChange = async (serialNumber, field, value) => {
    // 1️⃣ Update local state immediately for UI
    const updatedAssignments = assignments.map((item) =>
      item.serialNumber === serialNumber
        ? { ...item, [field]: value }
        : item
    );
    setAssignments(updatedAssignments);

    // 2️⃣ Update Redux store
    dispatch(updateAssignment({ serialNumber, field, value }));

    // 3️⃣ Prepare payload for backend
    const updatedItem = updatedAssignments.find(
      (item) => item.serialNumber === serialNumber
    );
    if (!updatedItem) return;

    try {
      await fetch(`${import.meta.env.VITE_BACKEND}/assignment/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      });
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  return (
    <div className="overflow-x-auto mt-6 p-4">
      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4">Serial</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Assignment 1</th>
            <th className="py-2 px-4">Assignment 2</th>
            <th className="py-2 px-4">Assignment 3</th>
            <th className="py-2 px-4">Assignment 4</th>
            <th className="py-2 px-4">Assignment 5</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((item) => (
            <tr key={item._id} className="text-center border-b">
              <td className="py-2 px-4">{item.serialNumber}</td>
              <td className="py-2 px-4">{item.name}</td>
              {[1, 2, 3, 4, 5].map((num) => {
                const field = `assignment${num}`;
                return (
                  <td className="py-2 px-4" key={field}>
                    <input
                      type="checkbox"
                      checked={item[field]}
                      disabled={user.email != "admin@admin.com"} // only admin can edit
                      onChange={(e) =>
                        handleCheckboxChange(
                          item.serialNumber,
                          field,
                          e.target.checked
                        )
                      }
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
