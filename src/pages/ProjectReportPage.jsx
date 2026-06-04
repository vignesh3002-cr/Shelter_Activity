import { useEffect, useState, useRef } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import SiteActivityPage from "./SiteActivityPage";
import SuccessPopup from "./SuccessTick";
import { LoaderCircle } from "lucide-react";

const fieldLabels = {

  DisciplineAction: "Discipline Action",
  DisciplineTypes: "Discipline Type",

  UpdatedBy: "Updated By",
  WorkerId: "Worker ID",

  ApprovedQty: "Approved Qty",
  ApprovedPercentage: "Approved %",

  DraftQty: "Draft Qty",
  DraftPercentage: "Draft %",

  RejectedQty: "Rejected Qty",
  RejectedPercentage: "Rejected %",

  PendingappQty: "Pending Qty",
  PendingappPercentage: "Pending %",

  CreatedQty: "Created Qty",
  CreatedPercentage: "Created %",

  ReturnedQty: "Returned Qty",
  ReturnedPercentage: "Returned %",

  SubmittedQty: "Submitted Qty",
  SubmittedPercentage: "Submitted %",

  CancelledQty: "Cancelled Qty",
  CancelledPercentage: "Cancelled %"
};

export default function ProjectReportPage({
  selectedProject,
  onBack
}) {

  const API =
    import.meta.env.VITE_API_URL;

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [reportData, setReportData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedDate,
  setSelectedDate] =
    useState(today);

  const [showModal,
  setShowModal] =
    useState(false);

  const [previousRecord,
  setPreviousRecord] =
    useState(null);

  const [errors,
  setErrors] =
    useState({});

  const [saveError,
  setSaveError] =
    useState("");
  
  const fileInputRef=useRef(null);
  // IMAGE STATES
 const [imageLoading,setImageLoading]=useState(false)
  const [uploading,
  setUploading] =
    useState(false);

  const [images,
  setImages] =
    useState([]);

  const [previewImages,
  setPreviewImages] =
    useState([]);

  const [showGallery,
  setShowGallery] =
    useState(false);

  const [formData, setFormData] = useState({

  DisciplineAction: "",
  DisciplineTypes: "",

  ApprovedQty: 0,
  ApprovedPercentage: 0,

  DraftQty: 0,
  DraftPercentage: 0,

  RejectedQty: 0,
  RejectedPercentage: 0,

  PendingappQty: 0,
  PendingappPercentage: 0,

  CreatedQty: 0,
  CreatedPercentage: 0,

  ReturnedQty: 0,
  ReturnedPercentage: 0,

  SubmittedQty: 0,
  SubmittedPercentage: 0,

  CancelledQty: 0,
  CancelledPercentage: 0,

  // MOVE THESE TO LAST
  UpdatedBy: "",
  WorkerId: "000003"
});
    
    const [successTick,setSuccess]=useState(false);
  useEffect(() => {

    fetchReport();

  }, [selectedDate]);

  // =========================================
  // FETCH REPORT
  // =========================================

  const fetchReport = async () => {

    try {

      setLoading(true);

      const projectId =
        selectedProject?.ProjectID;

      const res = await axios.get(
        `${API}/api/project-report/${projectId}?date=${selectedDate}`
      );

      const sorted =
        (res.data.value || []).reverse();

      setReportData(sorted);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  // =========================================
  // VALIDATION
  // =========================================

  const validateField = (
    key,
    value
  ) => {

    const previous =
      previousRecord?.[key];

    const fieldsToValidate = [

      "ApprovedQty",
      "ApprovedPercentage",

      "DraftQty",
      "DraftPercentage",

      "SubmittedQty",
      "SubmittedPercentage",

      "CreatedQty",
      "CreatedPercentage"
    ];

    if (
      fieldsToValidate.includes(key)
    ) {

      if (
        Number(value) <
        Number(previous || 0)
      ) {

        setErrors(prev => ({

          ...prev,

          [key]:
            `${fieldLabels[key] || key} cannot be less than previous value (${previous})`
        }));

        return false;
      }
    }

    setErrors(prev => ({

      ...prev,

      [key]: ""
    }));

    return true;
  };

  // =========================================
  // SAVE NEW RECORD
  // =========================================
  const remove=(id)=>{
    const after_remove=previewImages.filter((_,index)=>
      index!==id
    )
    setPreviewImages(after_remove);
     const updatedImages =
    images.filter((_, index) =>
      index !== id
    );

  setImages(updatedImages);

  if(updatedImages.length===0)
  fileInputRef.current.value = "";
  }
  const handleSave = async () => {

    try {
      setLoading(true);
      setSaveError("");
      
  await axios.post(

  `${API}/api/project-report/create`,

  {

    ...formData,

    WorkerId:
      formData.WorkerId,

    ProjId:
      selectedProject?.ProjectID,

    ProjDate:
      selectedDate
  }
);
      setSuccess(true);
      setTimeout(()=>{
        setSuccess(false);
      },3000)
      setShowModal(false);

      fetchReport();

    } catch (error) {

      console.log(error);

      const d365Error =

        error?.response?.data?.details ||

        error?.response?.data?.message ||

        error?.response?.data?.error ||

        "Failed to create record";

      setSaveError(d365Error);
    }
  };

  // =========================================
  // IMAGE CHANGE
  // =========================================

  const handleImageChange =
    async (e) => {
      
      const files =
        Array.from(e.target.files);
        setImageLoading(true);

      const previewList = [];
      
      const imageList = [];

      for (const file of files) {

        try {

         const compressedFile =
  await imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1280,
    initialQuality: 0.6,
    useWebWorker: true,
    fileType: "image/jpeg",
  });
  console.log(
  compressedFile.size / 1024 / 1024,
  "MB"
);
const uniqueFileName =
  `${selectedProject.ProjectID}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.jpg`;
          
          previewList.push(

            URL.createObjectURL(
              compressedFile
            )
          );
        
          imageList.push({

            imagename:
              uniqueFileName,

            projectimage:
              compressedFile,
          });

        } catch (error) {

          console.log(error);
        }
      }

      setPreviewImages(previewList);

      setImages(imageList);
      setImageLoading(false);
    };

  // =========================================
  // UPLOAD IMAGES
  // =========================================

  const uploadImages =
    async () => {

      try {

        setLoading(true);

        for (const image of images) {

          const formData =
            new FormData();

          formData.append(
            "image",
            image.projectimage
          );

          formData.append(
            "ProjectId",
            selectedProject?.ProjectID
          );

          formData.append(
            "ImageName",
            image.imagename
          );

          formData.append(
            "ProjDate",
          selectedDate
          );
          

          await axios.post(

            `${API}/api/upload/upload-images`,

            formData,

            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );
        }

        //alert("Images Uploaded Successfully");
        setSuccess(true);
        setTimeout(()=>{
          setSuccess(false);
        },3000)

        setImages([]);

        setPreviewImages([]);

        setUploading(false);

      } catch (error) {

        console.log(error);

        alert("Upload Failed");

      } finally {

        setLoading(false);
      }
    };

  // =========================================
  // SHOW GALLERY PAGE
  // =========================================

  if (showGallery) {

    return (

     <SiteActivityPage

  project={selectedProject}

  selectedDate={selectedDate}

  onBack={() =>
    setShowGallery(false)
  }
/>
    );
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-screen bg-gray-100">

        <div className="text-xl font-semibold text-gray-600">

          Loading Report...

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* HEADER 

            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-white transition bg-black rounded-lg hover:bg-gray-800"
            >
              Back
            </button>*/}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
              <button className="md:hidden h-10 top-2 right-2 flex items-center justify-center absolute w-12 bg-gray-100 border border-gray-400 rounded-lg" onClick={onBack} >
          <svg  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"/></svg>
        </button>

        <div className="flex flex-col w-full gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">

          <div>

            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">

              Project Report

            </h1>

            <p className="mt-1 text-sm text-gray-500">

              {selectedProject?.ProjectName}

            </p>

            <div className="mt-4 flex gap-2 justify-center items-center">

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
                        {
              selectedDate === today && (

                <button

                  onClick={() => {

                    const latest =
                      reportData[0];

                    setPreviousRecord(latest);

                    setErrors({});
                    setSaveError("");

                    setFormData({

  DisciplineAction:
    latest?.DisciplineAction || "",

  DisciplineTypes:
    latest?.DisciplineTypes || "",

  ApprovedQty:
    latest?.ApprovedQty || 0,

  ApprovedPercentage:
    latest?.ApprovedPercentage || 0,

  DraftQty:
    latest?.DraftQty || 0,

  DraftPercentage:
    latest?.DraftPercentage || 0,

  RejectedQty:
    latest?.RejectedQty || 0,

  RejectedPercentage:
    latest?.RejectedPercentage || 0,

  PendingappQty:
    latest?.PendingappQty || 0,

  PendingappPercentage:
    latest?.PendingappPercentage || 0,

  CreatedQty:
    latest?.CreatedQty || 0,

  CreatedPercentage:
    latest?.CreatedPercentage || 0,

  ReturnedQty:
    latest?.ReturnedQty || 0,

  ReturnedPercentage:
    latest?.ReturnedPercentage || 0,

  SubmittedQty:
    latest?.SubmittedQty || 0,

  SubmittedPercentage:
    latest?.SubmittedPercentage || 0,

  CancelledQty:
    latest?.CancelledQty || 0,

  CancelledPercentage:
    latest?.CancelledPercentage || 0,

  // LAST
  UpdatedBy:
    latest?.UpdatedBy || "",

  WorkerId:
    latest?.WorkerId || "000003"
});

                    setShowModal(true);
                  }}

                  className="px-4 flex justify-center items-center gap-2 py-2 text-base border border-gray-400 font-medium text-white transition bg-black rounded-lg hover:bg-blue-700"
                >
                  New
                  <span><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF"><path d="M760-200v-120H200v120h560Zm0-200v-160H200v160h560Zm0-240v-120H200v120h560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z"/></svg></span>
                  

                </button>
              )
            }

            </div>

          </div>
          <div className="flex items-center justify-center md:flex-col md:gap-4 md:items-end">
            <button className="hidden h-10 md:flex items-center justify-center w-12 bg-gray-100 border border-gray-400 rounded-lg" onClick={onBack} >
          <svg  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"/></svg>
        </button>

          <div className="flex flex-wrap items-center  gap-3 mt-4">

            

            {/* UPLOAD */}

         
            {/* VIEW IMAGES */}

            <button

              onClick={() =>
                setShowGallery(true)
              }

              className="px-4 py-2 text-sm font-medium text-black border border-gray-600 bg-gray-100 rounded-lg flex justify-center items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M120-200q-33 0-56.5-23.5T40-280v-400q0-33 23.5-56.5T120-760h400q33 0 56.5 23.5T600-680v400q0 33-23.5 56.5T520-200H120Zm600-320q-17 0-28.5-11.5T680-560v-160q0-17 11.5-28.5T720-760h160q17 0 28.5 11.5T920-720v160q0 17-11.5 28.5T880-520H720Zm40-80h80v-80h-80v80ZM120-280h400v-400H120v400Zm40-80h320L375-500l-75 100-55-73-85 113Zm560 160q-17 0-28.5-11.5T680-240v-160q0-17 11.5-28.5T720-440h160q17 0 28.5 11.5T920-400v160q0 17-11.5 28.5T880-200H720Zm40-80h80v-80h-80v80Zm-640 0v-400 400Zm640-320v-80 80Zm0 320v-80 80Z"/></svg>
              View Gallery

            </button>

            {/* BACK */}
              {/* UPLOAD ONLY FOR TODAY */}

{
  selectedDate === today && (

    <button

      onClick={() =>
        setUploading(true)
      }

      className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black flex justify-center items-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
      Upload Images

    </button>
    
  )
}



          </div>
          
          </div>
          

        </div>
    
      </div>

      {/* CONTENT */}

      <div className="p-4 md:p-8">

        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3">

          <div className="p-4 bg-white border border-gray-200 rounded-xl">

            <div className="text-sm text-gray-500">

              Total Records

            </div>

            <div className="mt-2 text-2xl font-bold text-gray-900">

              {reportData.length}

            </div>

          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">

            <div className="text-sm text-gray-500">

              Project ID

            </div>

            <div className="mt-2 text-lg font-semibold text-gray-900">

              {reportData[0]?.ProjId || "-"}

            </div>

          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-xl">

            <div className="text-sm text-gray-500">

              Last Updated By

            </div>

            <div className="mt-2 text-sm font-semibold text-gray-900 break-words">

              {reportData[0]?.UpdatedBy || "-"}

            </div>

          </div>

        </div>

        {

          reportData.length > 0 && (

            <div className="overflow-x-auto bg-white border border-gray-200 shadow-sm rounded-xl">

              <table className="min-w-full text-sm">

                <thead className="sticky top-0 bg-gray-100">

                  <tr>

                    {
                      Object.keys(reportData[0])

                        .filter(
                          key =>

                            !key.startsWith("@") &&

                            key !== "dataAreaId" &&
                            key !== "ProjId" &&
                            key !== "ProjDate"
                        )

                        .map((key) => (

                          <th
                            key={key}
                            className="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase border-b whitespace-nowrap"
                          >

                            {fieldLabels[key] || key}

                          </th>

                        ))
                    }

                  </tr>

                </thead>

                <tbody>

                  {
                    reportData.map((row, index) => (

                      <tr
                        key={index}
                        className="transition-colors border-b hover:bg-gray-50"
                      >

                        {
                          Object.entries(row)

                            .filter(
                              ([key]) =>

                                !key.startsWith("@") &&

                                key !== "dataAreaId" &&
                                key !== "ProjId" &&
                                key !== "ProjDate"
                            )

                            .map(([key, value]) => (

                              <td
                                key={key}
                                className="px-4 py-3 text-gray-700 whitespace-nowrap"
                              >

                                {
                                  value === null
                                    ? "-"
                                    : String(value)
                                }

                              </td>

                            ))
                        }

                      </tr>

                    ))
                  }

                </tbody>

              </table>

            </div>
          )
        }

      </div>

      {/* NEW RECORD MODAL */}

      {
        showModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40">

            <div className="w-full max-w-6xl p-4 overflow-y-auto bg-white shadow-2xl rounded-2xl max-h-[95vh] md:p-6">

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-xl font-bold md:text-2xl">

                  Add New Record

                </h2>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>

              </div>

              {
                saveError && (

                  <div className="p-4 mb-4 text-sm text-red-700 border border-red-300 rounded-lg bg-red-50">

                    {saveError}

                  </div>
                )
              }

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {

                  Object.keys(formData).map((key) => (

                    <div key={key}>

                      <label className="block mb-1 text-sm font-medium text-gray-700">

                        {fieldLabels[key] || key}

                      </label>

                      {key === "DisciplineAction" ? (

  <select
    value={formData[key]}
    onChange={(e) => {
      setFormData({
        ...formData,
        [key]: e.target.value
      });
    }}
    className="w-full p-3 border border-gray-300 rounded-lg transition-all"
  >
    <option value="">Select Discipline Action</option>
    <option value="Created">Mechanical</option>
    <option value="Submitted">MET Action</option>
    <option value="Approved">MET ARCH</option>
    <option value="Rejected">MET Civil</option>
    <option value="Pending">ΜΕΤ ΜΕΡ</option>
  </select>

) : key === "DisciplineTypes" ? (

  <select
    value={formData[key]}
    onChange={(e) => {
      setFormData({
        ...formData,
        [key]: e.target.value
      });
    }}
    className="w-full p-3 border border-gray-300 rounded-lg transition-all"
  >
    <option value="">Select Discipline Type</option>
    <option value="Civil">Civil</option>
    <option value="Mechanical">Electrical</option>
    <option value="Electrical">IT</option>
    <option value="Instrumentation">Mechanical</option>
  </select>

) : (

  <input
    disabled={key === "WorkerId"}
    type={
      typeof formData[key] === "number"
        ? "number"
        : "text"
    }
    value={formData[key]}
    onChange={(e) => {

      const value =
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value;

      setFormData({
        ...formData,
        [key]: value
      });

      validateField(
        key,
        value
      );
    }}
    className={`w-full p-3 border rounded-lg transition-all ${
      errors[key]
        ? "border-red-500 bg-red-50"
        : "border-gray-300"
    }`}
  />

)}

                      {

                        previousRecord && (

                          <p className="mt-1 text-xs text-gray-400">

                            Previous:
                            {" "}
                            {
                              previousRecord[key]
                            }

                          </p>
                        )
                      }

                      {

                        errors[key] && (

                          <p className="mt-1 text-xs text-red-500">

                            {errors[key]}

                          </p>
                        )
                      }

                    </div>
                  ))
                }

              </div>

              <div className="flex flex-col justify-end gap-3 mt-6 sm:flex-row">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button

                  disabled={
                    Object.values(errors)
                      .some(Boolean)
                  }

                  onClick={handleSave}

                  className={`px-4 py-2 text-white rounded-lg

                  ${Object.values(errors).some(Boolean)

                    ? "bg-gray-400 cursor-not-allowed"

                    : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Save
                </button>

              </div>

            </div>

          </div>
        )
      }

      {/* UPLOAD IMAGE MODAL */}

      {
        uploading && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">

            <div className="w-full max-w-5xl p-6 overflow-y-auto max-h-[95vh] bg-white rounded-2xl">

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold">

                  Upload Images

                </h2>

                <button
                  onClick={() =>
                    setUploading(false)
                  }
                  className="text-2xl"
                >
                  ×
                </button>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={
                  handleImageChange
                }
              />
              <p className="mt-2 text-sm text-gray-500">
  Selected Files: {images.length}
</p>
                 {imageLoading && (

        <div className="flex flex-col items-center justify-center mt-8">

          {/* SPINNER */}
          <LoaderCircle
            className="text-black animate-spin"
            size={50}
          />

          <p className="mt-3 text-sm text-gray-500">
            Uploading Images...
          </p>

        </div>

      )}
      
           {!imageLoading && ( <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-3 lg:grid-cols-4">

                {
                  previewImages.map(
                    (
                      image,
                      index
                    ) => (
                      <div className="relative" key={index}>
                        <button onClick={()=>remove(index)}><svg className="absolute z-20 cursor-pointer top-1 right-1"  xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
</button>
                      <img
                        src={image}
                        alt=""
                        className="object-cover w-full rounded-xl h-52"
                      />
                      </div>
                    )
                  )
                }

              </div>
           )}
              {
                images.length > 0 && (

                  <button
                    onClick={
                      uploadImages
                    }
                    className="px-6 py-3 mt-6 text-white bg-black rounded-xl hover:bg-gray-800"
                  >
                    Upload To D365
                  </button>
                )
              }
              
            </div>

          </div>
        )
      }
      <SuccessPopup show={successTick}/>
    </div>
  );
}