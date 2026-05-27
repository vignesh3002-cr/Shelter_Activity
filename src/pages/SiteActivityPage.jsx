import axios from "axios";
import {
  useState,
  useEffect
}
from "react";

import { motion }
from "framer-motion";

export default function SiteActivityPage({

  project,
  selectedDate,
  onBack

}) {

  const [images,
  setImages] =
    useState([]);

  const [loading,
  setLoading] =
    useState(true);

  const username =
    localStorage.getItem(
      "username"
    ) || "Unknown User";

  const initials =
    username
      ?.substring(0, 2)
      .toUpperCase();

  // =========================
  // NO PROJECT
  // =========================

  if (!project) {

    return (

      <div className="flex items-center justify-center h-screen bg-gray-100">

        <p className="text-xl text-gray-500">

          No project selected.

        </p>

      </div>
    );
  }

  // =========================
  // FETCH IMAGES
  // =========================

  useEffect(() => {

    const fetchImages =
      async () => {

        try {

          setLoading(true);

          const response =
  await axios.get(

    `http://localhost:5000/api/upload/images/${project.ProjectID}`

  );

console.log(
  "ALL IMAGES:",
  response.data
);

// FILTER DATE IN REACT

const filteredImages =
  response.data.filter((item) => {

    if (!item.ProjDate)
      return false;

    const imageDate =
      item.ProjDate
        .split("T")[0];

    return imageDate === selectedDate;
  });

console.log(
  "FILTERED IMAGES:",
  filteredImages
);

setImages(filteredImages);
        } catch (error) {

          console.log(
            "IMAGE FETCH ERROR:",
            error
          );

        } finally {

          setLoading(false);
        }
      };

    fetchImages();

  }, [project.ProjectID]);

  // =========================
  // MAIN UI
  // =========================

  return (

    <div className="min-h-screen bg-gray-100">

      {/* ========================= */}
      {/* LOADING */}
      {/* ========================= */}

      {
        loading && (

          <div className="flex items-center justify-center h-screen">

            <motion.img

              className="w-32 h-32"

              src="/Shelter_logo.png"

              animate={{

                scale: [1, 1.2, 1],

                rotate: [0, 5, -5, 0]
              }}

              transition={{

                duration: 1.5,

                repeat: Infinity
              }}
            />

          </div>
        )
      }

      {/* ========================= */}
      {/* CONTENT */}
      {/* ========================= */}

      {
        !loading && (

          <>

            {/* HEADER */}

            <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">

              <div className="flex items-center justify-between h-16 px-4 md:px-6">

                {/* LEFT */}

                <div className="flex items-center gap-3">

                  <button

                    onClick={onBack}

                    className="flex items-center justify-center w-10 h-10 transition border rounded-lg hover:bg-gray-100"
                  >
                    ←
                  </button>

                  <div>

                    <div className="text-xs text-gray-400 uppercase">

                      {project.ProjectID}

                    </div>

                    <div className="font-bold text-gray-900">

                      {project.ProjectName}

                    </div>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full">

                  {initials}

                </div>

              </div>

            </header>

            {/* TITLE */}

            <div className="px-4 py-6 md:px-6">

              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">

                Site Activity Gallery

              </h1>

              <p className="mt-2 text-sm text-gray-500 md:text-base">

                Construction activity images uploaded to D365

              </p>

            </div>

            {/* IMAGE GRID */}

            <div className="grid grid-cols-1 gap-6 px-4 pb-10 md:px-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {
                images.length === 0 ? (

                  <div className="col-span-full">

                    <div className="p-10 text-center bg-white shadow-sm rounded-2xl">

                      <h2 className="text-xl font-semibold text-gray-700">

                        No Images Found

                      </h2>

                      <p className="mt-2 text-gray-500">

                        No uploaded images available for this project

                      </p>

                    </div>

                  </div>

                ) : (

                  images.map(

                    (item, index) => {

                      // =========================
                      // D365 IMAGE FIELD CHECK
                      // =========================

                      const imageData =

                        item.ProjectImage ||

                        item.projectimage ||

                        item.Image ||

                        item.image ||

                        item.Projectimage ||

                        "";

                      // =========================
                      // BASE64 IMAGE
                      // =========================

                      const imageSrc =

                        imageData
                          ? `data:image/jpeg;base64,${imageData}`
                          : "";

                      return (

                        <div

                          key={index}

                          className="overflow-hidden transition-all duration-300 bg-white border shadow-md rounded-2xl hover:shadow-2xl hover:-translate-y-2"
                        >

                          {/* IMAGE */}

                          <div className="relative overflow-hidden h-72 bg-gray-100">

                            {
                              imageSrc ? (

                                <img

                                  src={imageSrc}

                                  alt={item.ImageName}

                                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                                />

                              ) : (

                                <div className="flex items-center justify-center w-full h-full text-gray-400">

                                  No Image

                                </div>
                              )
                            }

                          </div>

                          {/* CONTENT */}

                          <div className="p-5">

                            <div className="flex items-center justify-between">

                              <h2 className="text-lg font-bold text-gray-800 truncate">

                                {
                                  item.ImageName ||
                                  "Project Image"
                                }

                              </h2>

                              <span className="text-xs text-gray-400">

                                #{index + 1}

                              </span>

                            </div>

                            <p className="mt-2 text-sm text-gray-500">

                              Uploaded construction activity image

                            </p>

                            {/* DOWNLOAD */}

                            {
                              imageSrc && (

                                <a

                                  href={imageSrc}

                                  download={
                                    item.ImageName ||
                                    "image.jpg"
                                  }

                                  className="block px-4 py-2 mt-5 text-center text-gray-700 transition bg-gray-100 rounded-xl hover:bg-gray-200"
                                >

                                  Download

                                </a>
                              )
                            }

                          </div>

                        </div>
                      );
                    }
                  )
                )
              }

            </div>

          </>
        )
      }

    </div>
  );
}