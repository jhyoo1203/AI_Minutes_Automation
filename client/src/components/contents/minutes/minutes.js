import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import apiClient from "api";
import { useNavigate } from "react-router-dom";

const Minutes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempMinutes, setTempMinutes] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isCollapsed = useSelector(state => state.isCollapsed);

  useEffect(() => {
    apiClient.get("/minutes/temp").then((response) => {
      if (response.data !== null) {
        setTempMinutes(response.data);
      } else {
        setTempMinutes({});
      }
    });
  }, []);

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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }
  
      const attendeesArray = tempMinutes.attendees ? tempMinutes.attendees.split(',').map(name => ({ name: name.trim() })) : [];
      if (attendeesArray.length === 0) {
        alert("Please add at least one attendee.");
        return;
      }
  
      const updatedTempMinutes = {
        ...tempMinutes,
        attendees: attendeesArray,
      };
  
      const response = await apiClient.post("/minutes/save", {
        minutesData: updatedTempMinutes,
        token,
      });
  
      if (response.status === 201) {
        setTempMinutes({});
        alert("회의록 저장 성공!");
        navigate("/");
      } else {
        console.error("Error saving minutes: ", response.statusText);
        setError(`Error saving minutes: ${response.statusText}. Please try again.`);
      }
    } catch (error) {
      console.error("Error saving minutes: ", error);
      setError("Error saving minutes. Please try again.");
    }
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
      <p className="text-3xl font-bold mt-20 text-center">
        회의록 작성을 작성하기 위해 오디오 파일을 업로드해주세요.
      </p>
      <div className="flex justify-center items-center mt-12">
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
      <div className="flex mt-10 ml-40">
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
              onClick={() => handleSave()}
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
