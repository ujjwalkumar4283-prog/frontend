// import { NavLink } from "react-router-dom";

// const subjects = ["subject1", "subject2", "subject3", "subject4", "subject5"];

// function SubjectTabs() {
//   return (
//     <div className="flex flex-wrap justify-center gap-2 mb-6">
//       {subjects.map((sub) => (
//         <NavLink
//           key={sub}
//           to={`/assignments/${sub}`}
//           className={({ isActive }) =>
//             `px-3 py-1.5 rounded-full font-semibold text-sm transition 
//              ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`
//           }
//         >
//           {sub.toUpperCase()}
//         </NavLink>
//       ))}
//     </div>
//   );
// }

// export default SubjectTabs;




import { NavLink } from "react-router-dom";

const subjects =[
  {name:"ICP",route:"subject1"},
  {name:"DM",route:"subject2"},
  {name:"UHV",route:"subject3"},
  {name:"UPM",route:"subject4"},
  {name:"CALCULUS",route:"subject5"},

  ]
function SubjectTabs() {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {subjects.map((sub) => (
        <NavLink
          key={sub.route}
          to={`/assignments/${sub.route}`}
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-full font-semibold text-sm transition 
             ${isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`
          }
        >
          {sub.name.toUpperCase()}
        </NavLink>
      ))}
    </div>
  );
}

export default SubjectTabs;

