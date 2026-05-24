import axios from "axios";
import { useState } from "react";

export default function SiteActivityPage() {
  const API =
  "http://localhost:5000/api/upload";

const uploadImages = async (formData) => {

  const response = await axios.post(
    API,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};
const ImageUpload = () => {

  const [files, setFiles] =
    useState([]);

  const [preview, setPreview] =
    useState([]);

  const handleChange = (e) => {

    const selectedFiles =
      Array.from(e.target.files);

    setFiles(selectedFiles);

    const imagePreview =
      selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );

    setPreview(imagePreview);
  };

  const handleUpload =
    async () => {

      const formData =
        new FormData();

      files.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      formData.append(
        "projectId",
        "PRJ001"
      );

      try {

        const response =
          await uploadImages(
            formData
          );

        console.log(response);

        alert("Upload Success");

      } catch (error) {

        console.log(error);

        alert("Upload Failed");
      }
    };

  return (
    <div>
        <h1>
            Site Activity Upload
        </h1>
        <div>

        <input
            type="file"
            multiple
            accept="image/*"
            capture="environment"
            onChange={handleChange}
        />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >

        {preview.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            width="150"
          />
        ))}

      </div>

      <button
        onClick={handleUpload}
      >
        Upload Images
      </button>

    </div>
    </div>
  );
};
}