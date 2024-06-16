import React, { useState } from "react";
import { useSelector } from 'react-redux';
import apiClient from "api";

const Minutes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempMinutes, setTempMinutes] = useState({});
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

      console.log(response.data);

      setTempMinutes(response.data.tempMinutes);
      console.log(response.data.tempMinutes);
    } catch (error) {
      console.error("Error uploading file: ", error);
      setError("Error uploading file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setTempMinutes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const labelMapping = {
    title: "제목",
    department: "부서",
    timeStart: "시작 시간",
    timeEnd: "종료 시간",
    place: "장소",
    item: "안건",
    content: "내용",
    decision: "결정 내용",
    attendees: "참석자",
  };

  return (
    <div className={`flex flex-col w-full transition-all duration-75 ease-in-out h-screen ${isCollapsed ? "pl-40" : "pl-64"}`}>
      <div className="flex justify-center items-center mt-8">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={handleUpload}
          disabled={uploading}
        >
          <p className={`${uploading && "animate-pulse"}`}>{uploading ? "업로드 중..." : "회의 업로드"}</p>
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      <div className="flex">
        {Object.keys(tempMinutes).length > 0 && (
          <div className="mt-3 w-[1000px] ml-28">
            <h2 className="text-2xl font-bold mb-5">회의 내용</h2>
            <ul className="flex flex-col">
              {Object.entries(tempMinutes).map(([key, value], index) => (
                <li key={index} className="mb-4 w-5/6">
                  <div className="flex justify-between items-center">
                    <strong className="w-1/4">{labelMapping[key] || key}:</strong>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className="w-3/4 border border-gray-300 p-2 rounded"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {Object.keys(tempMinutes).length > 0 && (
          <div className="mt-64 text-center">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 -ml-16 rounded mt-4"
              onClick={() => console.log(tempMinutes)}
            >
              회의록 저장
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Minutes;
