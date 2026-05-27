import { useEffect, useState } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import SiteActivityPage from "./SiteActivityPage";

const fieldLabels = {

  DisciplineAction: "Discipline Action",
  DisciplineTypes: "Discipline Type",

  UpdatedBy: "Updated By",

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

  // IMAGE STATES

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

  const [formData,
  setFormData] =
    useState({

      DisciplineAction: "",
      DisciplineTypes: "",
      UpdatedBy: "",

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
      CancelledPercentage: 0
    });

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

  const handleSave = async () => {

    try {

      setSaveError("");

      await axios.post(

        `${API}/api/project-report/create`,

        {

          ...formData,

          ProjId:
            selectedProject?.ProjectID,

          ProjDate:
            selectedDate
        }
      );

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

      const previewList = [];

      const imageList = [];

      for (const file of files) {

        try {

          const compressedFile =
            await imageCompression(
              file,
              {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
              }
            );

          previewList.push(

            URL.createObjectURL(
              compressedFile
            )
          );

          imageList.push({

            imagename:
              compressedFile.name,

            projectimage:
              compressedFile,
          });

        } catch (error) {

          console.log(error);
        }
      }

      setPreviewImages(previewList);

      setImages(imageList);
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

            "http://localhost:5000/api/upload/upload-images",

            formData,

            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );
        }

        alert(
          "Images Uploaded Successfully"
        );

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

      {/* HEADER */}

      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">

        <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">

          <div>

            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">

              Project Report

            </h1>

            <p className="mt-1 text-sm text-gray-500">

              {selectedProject?.ProjectName}

            </p>

            <div className="mt-4">

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

            </div>

          </div>

          <div className="flex flex-wrap items-center gap-3">

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

                      UpdatedBy:
                        latest?.UpdatedBy || "",

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
                        latest?.CancelledPercentage || 0
                    });

                    setShowModal(true);
                  }}

                  className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >

                  + New

                </button>
              )
            }

            {/* UPLOAD */}

           {/* UPLOAD ONLY FOR TODAY */}

{
  selectedDate === today && (

    <button

      onClick={() =>
        setUploading(true)
      }

      className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black"
    >

      Upload Images

    </button>
  )
}

            {/* VIEW IMAGES */}

            <button

              onClick={() =>
                setShowGallery(true)
              }

              className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg"
            >

              View Images

            </button>

            {/* BACK */}

            <button
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-white transition bg-black rounded-lg hover:bg-gray-800"
            >
              Back
            </button>

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

                      <input

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

                        className={`w-full p-3 border rounded-lg transition-all

                        ${errors[key]

                          ? "border-red-500 bg-red-50"

                          : "border-gray-300"
                        }`}
                      />

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

            <div className="w-full max-w-5xl p-6 bg-white rounded-2xl">

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
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={
                  handleImageChange
                }
              />

              <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-3 lg:grid-cols-4">

                {
                  previewImages.map(
                    (
                      image,
                      index
                    ) => (

                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="object-cover w-full rounded-xl h-52"
                      />
                    )
                  )
                }

              </div>

              {
                images.length > 0 && (

                  <button
                    onClick={
                      uploadImages
                    }
                    className="px-6 py-3 mt-6 text-white bg-blue-600 rounded-xl"
                  >
                    Upload To D365
                  </button>
                )
              }

            </div>

          </div>
        )
      }

    </div>
  );
}