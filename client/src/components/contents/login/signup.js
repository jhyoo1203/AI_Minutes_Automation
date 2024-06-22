import React, { useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  const isCollapsed = useSelector((state) => state.isCollapsed);

  const navigate = useNavigate();

  const handleSignup = () => {
    if (
      name === "" ||
      password === "" ||
      confirmPassword === "" ||
      email === ""
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    apiClient
      .post("/users/signup", {
        name: name,
        password: password,
        email: email,
      })
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div
      className={`flex flex-col w-full ${
        isCollapsed ? "pl-40" : "pl-64"
      } items-center mt-28`}
    >
      <div className="w-96 p-10 bg-white rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold m-8">회원가입</h1>

        <div className="mb-6 relative flex flex-col items-center">
          <label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 px-3 py-2 bg-white border focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-72 sm:text-sm focus:ring-1 rounded-lg`}
              placeholder="이름을 입력해주세요."
              onKeyPress={handleKeyPress}
            />
          </label>
          <label>
            <label>
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-5 px-3 py-2 bg-white border focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-72 sm:text-sm focus:ring-1 rounded-lg`}
                placeholder="이메일을 입력해주세요."
                onKeyPress={handleKeyPress}
              />
            </label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-5 px-3 py-2 bg-white border focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-72 sm:text-sm focus:ring-1 rounded-lg`}
              placeholder="비밀번호를 입력해주세요."
              onKeyPress={handleKeyPress}
            />
          </label>
          <label>
            <input
              type="password"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-5 px-3 py-2 bg-white border focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-72 sm:text-sm focus:ring-1 rounded-lg`}
              placeholder="비밀번호를 확인해주세요."
              onKeyPress={handleKeyPress}
            />
          </label>

          <button
            onClick={handleSignup}
            className="w-full py-5 mt-7 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full transition-all"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
