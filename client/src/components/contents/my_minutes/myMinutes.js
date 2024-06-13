import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import apiClient from "api";

const MyMinutes = () => {
  const [allMinutes, setAllMinutes] = useState([]);

  const isCollapsed = useSelector(state => state.isCollapsed);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    apiClient.get(`/minutes/user/${user.id}`).then((response) => {
      setAllMinutes(response.data);
      console.log(response.data);
    });
  }, [user.id]);

  return (
    <div className="bg-yellow-50 w-full h-screen">
      <div className={`flex flex-col w-full transition-all duration-75 ease-in-out ${isCollapsed ? "pl-40" : "pl-64"}`}>
        <div className="mt-20 ml-20">
          <p className="font-bold text-2xl">{user.name}님의 회의록</p>
        </div>
        <div className="flex flex-wrap w-full">
          {allMinutes.map((minutes, index) => (
            <div key={index} className="w-1/2 p-16">
              <div className="border-2 border-gray-300 bg-white rounded-lg p-5">
                <p className="font-bold text-xl">{minutes.title}</p>
                <p className="text-lg">{minutes.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyMinutes;
