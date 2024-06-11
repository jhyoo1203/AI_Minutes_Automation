import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FaHome } from "react-icons/fa";
import { MdStickyNote2 } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col h-screen p-5 bg-green-100 shadow-xl transition-all duration-75 ease-in-out ${
        isCollapsed ? "w-1/12" : "w-1/6"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className={"font-bold my-3"}>
          {!isCollapsed ? "로그인 필요합니다." : ""}
        </p>
        <div
          onClick={toggleSidebar}
          className="self-end mb-3 hover:cursor-pointer font-bold text-3xl"
          style={{ letterSpacing: "-0.25em", transform: "scaleY(1.5)" }}
        >
          {isCollapsed ? ">>" : "<<"}
        </div>
      </div>
      <nav
        className={`mt-10 flex flex-col items-center ${isCollapsed ? "hidden" : ""}`}
      >
        <Link
          to="/"
          className="w-full p-5 text-xl font-bold rounded-lg flex bg-green-50 shadow-md hover:shadow-lg"
        >
          <FaHome className="mt-1" />
          <p className="ml-2">홈</p>
        </Link>
        <Link
          to="/minutes"
          className="mt-5 w-full p-5 text-xl font-bold rounded-lg flex bg-green-50 shadow-md hover:shadow-lg"
        >
          <MdStickyNote2 className="mt-1" />
          <p className="ml-2">회의록 작성</p>
        </Link>
        <Link
          to="/myMinutes"
          className="mt-5 w-full p-5 text-xl font-bold rounded-lg flex bg-green-50 shadow-md hover:shadow-lg"
        >
          <IoIosPerson className="mt-1" />
          <p className="ml-2">내 회의록</p>
        </Link>
      </nav>
      <nav
        className={`mt-10 flex flex-col items-center ${!isCollapsed ? "hidden" : ""}`}
      >
        <Link
          to="/"
          className="w-full flex justify-center p-5 text-2xl font-bold rounded-lg bg-green-50 shadow-sm hover:shadow-lg"
        >
          <FaHome />
        </Link>
        <Link
          to="/minutes"
          className="mt-5 w-full flex justify-center p-5 text-2xl font-bold rounded-lg bg-green-50 shadow-sm hover:shadow-lg"
        >
          <MdStickyNote2 />
        </Link>
        <Link
          to="/myMinutes"
          className="mt-5 w-full flex justify-center p-5 text-2xl font-bold rounded-lg bg-green-50 shadow-sm hover:shadow-lg"
        >
          <IoIosPerson />
        </Link>
      </nav>

      <div className="flex justify-center items-center mt-auto">
        <div className="bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white px-5 py-2 rounded-lg">
          로그인
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
