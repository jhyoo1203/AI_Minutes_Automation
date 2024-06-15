import React, { useState } from "react";
import { useSelector } from 'react-redux';
import apiClient from "api";

const Minutes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isCollapsed = useSelector(state => state.isCollapsed);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await apiClient.post(
        "/minutes/transcription",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscription(response.data.transcription);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`flex flex-col w-full transition-all duration-75 ease-in-out h-screen ${isCollapsed ? "pl-40" : "pl-64"}`}>
      <div className="flex justify-center items-center mt-8">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Audio"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      {transcription && (
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold">Transcription Result:</h2>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default Minutes;
