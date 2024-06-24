import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "api";
import { useNavigate } from "react-router-dom";

const MyMinutes = () => {
  const [allMinutes, setAllMinutes] = useState([]);
  const navigate = useNavigate();
  const isCollapsed = useSelector((state) => state.isCollapsed);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    apiClient.get(`/minutes/user/${user.id}`).then((response) => {
      setAllMinutes(response.data);
    });
  }, [user.id]);

  const goToDetailPage = (minuteId) => {
    navigate(`/minutes/detail/${minuteId}`);
  };

  return (
    <div className="bg-yellow-50 w-full min-h-screen p-5">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isCollapsed ? "pl-40" : "pl-80"
        }`}
      >
        <div className="text-center py-10">
          <h1 className="font-semibold text-3xl text-gray-700">
            {user.name}님의 회의록
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allMinutes.map((minutes, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer p-6"
              onClick={() => goToDetailPage(minutes.id)}
            >
              <h2 className="font-semibold text-xl text-gray-800 mb-2">
                {minutes.title}
              </h2>
              <p className="text-gray-600">{minutes.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyMinutes;
