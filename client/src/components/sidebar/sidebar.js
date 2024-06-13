import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "./sidebarAction";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { MdStickyNote2 } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";

import apiClient from "api";

const Sidebar = () => {
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.isCollapsed);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    apiClient.post("/users/logout", {
      token,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div
      className={`flex flex-col h-screen p-5 bg-green-100 shadow-xl transition-all duration-75 ease-in-out fixed ${
        isCollapsed ? "w-1/12" : "w-1/6"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className={"font-bold my-3 md:text-sm sm:text-xs"}>
          {!isCollapsed
            ? user
              ? user.name + "님의 회의록"
              : "로그인이 필요합니다."
            : ""}
        </p>
        <div
          onClick={handleToggleSidebar}
          className="self-end mb-3 hover:cursor-pointer font-bold text-3xl md:text-2xl sm:text-xl"
          style={{ letterSpacing: "-0.25em", transform: "scaleY(1.5)" }}
        >
          {isCollapsed ? ">>" : "<<"}
        </div>
      </div>
      <nav
        className={`mt-10 flex flex-col text-lg md:text-base items-center ${
          isCollapsed ? "hidden" : ""
        }`}
      >
        <Link
          to="/"
          className="w-full p-5 font-bold rounded-lg flex bg-green-50 shadow-md hover:shadow-lg"
        >
          <FaHome className="mt-1" />
          <p className="ml-2">홈</p>
        </Link>
        {user ? (
          <Link
            to="/minutes"
            className="mt-5 w-full p-5 font-bold rounded-lg flex bg-green-50 shadow-md hover:shadow-lg"
          >
            <MdStickyNote2 className="mt-1" />
            <p className="ml-2">회의록 작성</p>
          </Link>
        ) : (
          <div
            className="mt-5 w-full p-5 font-bold rounded-lg flex bg-green-50 shadow-md hover:cursor-pointer hover:shadow-lg"
            onClick={() => alert("로그인이 필요합니다.")}
          >
            <MdStickyNote2 className="mt-1" />
            <p className="ml-2">회의록 작성</p>
          </div>
        )}
        {user ? (
          <Link
            to="/myMinutes"
            className="mt-5 w-full p-5 font-bold rounded-lg flex bg-green-50 shadow-md hover:shadow-lg"
          >
            <IoIosPerson className="mt-1" />
            <p className="ml-2">내 회의록</p>
          </Link>
        ) : (
          <div
            className="mt-5 w-full p-5 font-bold rounded-lg flex bg-green-50 shadow-md hover:shadow-lg hover:cursor-pointer"
            onClick={() => alert("로그인이 필요합니다.")}
          >
            <IoIosPerson className="mt-1" />
            <p className="ml-2">내 회의록</p>
          </div>
        )}
      </nav>
      <nav
        className={`mt-10 flex flex-col text-lg items-center ${
          !isCollapsed ? "hidden" : ""
        }`}
      >
        <Link
          to="/"
          className="w-full flex justify-center p-5 font-bold rounded-lg bg-green-50 shadow-sm hover:shadow-lg"
        >
          <FaHome />
        </Link>
        <Link
          to="/minutes"
          className="mt-5 w-full flex justify-center p-5 font-bold rounded-lg bg-green-50 shadow-sm hover:shadow-lg"
        >
          <MdStickyNote2 />
        </Link>
        <Link
          to="/myMinutes"
          className="mt-5 w-full flex justify-center p-5 font-bold rounded-lg bg-green-50 shadow-sm hover:shadow-lg"
        >
          <IoIosPerson />
        </Link>
      </nav>
      <div className="flex justify-center items-center mt-auto">
        {user ? (
          <>
            <div
              className="ml-3 bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white md:text-sm sm:text-xs px-3 md:px-1 sm:px-0 py-2 font-bold rounded-lg"
              onClick={handleLogout}
            >
              로그아웃
            </div>
          </>
        ) : (
          <Link to="/login">
            <div className="bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white md:text-sm sm:text-xs px-3 md:px-1 sm:px-0 py-2 font-bold rounded-lg">
              로그인
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
