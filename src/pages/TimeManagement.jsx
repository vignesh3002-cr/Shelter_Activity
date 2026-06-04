import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SuccessPopup from "./SuccessTick";
export default function TimeManagementPage({ selectedProjectID, onBack }) {

    const [timeData, setTimeData] = useState([]);
    const [search, setSearch] = useState("");
    const [editingRow, setEditingRow] = useState(null);
    const[loading, setLoading] = useState(false);
const [editedDate, setEditedDate] = useState("");
const API=import.meta.env.VITE_API_URL;
const [successTick,setSuccess]=useState(false);
    useEffect(() => {
        const fetchTimeData = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${API}/api/time-management/ViewTime`, { projectId: selectedProjectID });
                setTimeData(response.data.WBSActivityList);
                console.log("Fetched Time Data:", response.data.WBSActivityList);
            } catch (error) {
                console.error("Error fetching view time data:", error);
            } finally {
                setLoading(false);  
            }
        };

        if (selectedProjectID) {
            fetchTimeData();
        }
    }, [selectedProjectID]);
    
const filteredData = timeData.filter(
    (item) =>
      item.WBSId
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.TaskName
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );
  const handleEdit = (index, currentDate) => {
  setEditingRow(index);

  setEditedDate(
    currentDate?.split("T")[0] || ""
  );
};
function SearchIcon() {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle
          cx="7"
          cy="7"
          r="5"
          stroke="#ABABAB"
          strokeWidth="1.4"
        />
        <path
          d="M11 11l3 3"
          stroke="#ABABAB"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
const handleSubmit = async (
  item,
  newDate
) => {

  try {

    await axios.post(
      `${API}/api/time-management/update-date`,
      {
        projectId:
          selectedProjectID,

        wbsId:
          item.WBSId,

        taskEndDate:
          newDate
      }
    );
    setSuccess(true);
     setTimeout(()=>{
        setSuccess(false);
      },3000)

    const updated =
      [...timeData];

    updated[
      editingRow
    ].TaskEndDate =
      newDate;

    setTimeData(updated);

    setEditingRow(null);
   
 

  } catch (error) {

    console.error(error);

    alert(
      "Failed to update date"
    );

  }

};
  return (
    <div className="min-h-screen bg-gray-100">
      {loading && (
              <div className="flex items-center justify-center h-screen bg-gray-100">
      
                <motion.img
                  className="w-32 h-32 mx-auto"
                  src="/Shelter_logo.png"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
      
              </div>
            )}
            {!loading && timeData && (
      <div className="px-6 py-8 mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="flex flex-col gap-4 p-5 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">

          <div>
            <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Time Management
            </h1>
              <button className="flex items-center justify-center w-12 h-10 ml-4 bg-gray-100 border border-gray-400 rounded-lg " onClick={onBack} >
          <svg  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"/></svg>
        </button>
        </div>    

            <p className="mt-1 text-sm text-gray-500">
              Manage project task end dates
            </p>
          </div>

       
        </div>

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <p className="text-sm text-gray-500">
              Project ID
            </p>

            <h2 className="mt-2 text-xl font-bold text-gray-900">
              {selectedProjectID}
            </h2>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <p className="text-sm text-gray-500">
              Total Tasks
            </p>

            <h2 className="mt-2 text-xl font-bold text-blue-600">
              {timeData.length}
            </h2>
          </div>

        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center flex-1 gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by WBS ID or Task Name..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 text-sm outline-none"
          />

        </div>

        {/* TABLE */}
        <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="text-xs font-bold tracking-widest text-gray-700 uppercase bg-gray-50">


                  <th className="px-4 py-4 text-left">
                    Task Name
                  </th>

                  <th className="px-4 py-4 text-left">
                    End Date
                  </th>

                </tr>
              </thead>

             <tbody>

  {filteredData.length === 0 ? (

    <tr>
      <td
        colSpan="3"
        className="py-10 text-center text-gray-400"
      >
        No Tasks Found
      </td>
    </tr>

  ) : (

    filteredData.map((item, index) => (

      <tr
        key={item.WBSId || index}
        className="border-b hover:bg-gray-50"
      >



        {/* Task */}
        <td className="py-3 pl-4 pr-2 text-xs">
          {item.TaskName}
        </td>

        {/* End Date */}
        <td className="py-3 pl-2 pr-4 text-xs">

          {editingRow === index ? (

            <div className="flex flex-col gap-2">

              <input
                type="date"
                value={editedDate}
                onChange={(e) =>
                  setEditedDate(e.target.value)
                }
                className="px-2 py-1 border rounded-lg"
              />

              <div className="text-xs text-blue-600">
                Selected Date:
                {" "}
                {editedDate || "No date selected"}
              </div>

              <button
                className="px-3 py-1 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
               onClick={() =>
                  handleSubmit(
                    item,
                    editedDate
                  )
                }
              >
                Submit
              </button>

            </div>

          ) : (

            <div className="flex items-center gap-2">

              <span>
                {item.TaskEndDate?.split("T")[0]}
              </span>

              <button
                onClick={() =>
                  handleEdit(
                    index,
                    item.TaskEndDate
                  )
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
              </button>

            </div>

          )}

        </td>

      </tr>

    ))

  )}

</tbody>

            </table>

          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-4 text-xs text-center text-gray-500">
          Showing {filteredData.length} of{" "}
          {timeData.length} tasks
        </div>

      </div>
            )}
            <SuccessPopup show={successTick}/>
    </div>
  );
}