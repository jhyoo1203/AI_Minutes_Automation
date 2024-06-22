import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "api";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const isCollapsed = useSelector((state) => state.isCollapsed);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = "올바른 이메일을 입력해주세요.";
    }

    if (!validatePassword(password)) {
      newErrors.password = "비밀번호가 틀렸습니다.";
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await apiClient.post("/users/login", {
          email,
          password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        const expiryDate = new Date().getTime() + 60 * 60 * 1000;
        localStorage.setItem("expiryDate", expiryDate);
        navigate("/");
        window.location.reload();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          newErrors.login = "아이디 또는 비밀번호가 틀렸습니다.";
        } else {
          console.error(error);
        }
      }
    }

    setErrors(newErrors);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      className={`flex flex-col w-full ${
        isCollapsed ? "pl-40" : "pl-64"
      } items-center mt-28`}
    >
      <div className="w-96 p-10 bg-white rounded-lg shadow-lg border-2 border-gray-100">
        <h1 className="text-center text-2xl font-bold m-8">로그인</h1>

        <div className="mb-6 relative">
          <label>
            <input
              type="email"
              name="email"
              className={`mt-1 px-3 py-2 bg-white border focus:outline-none focus:border-green-500 focus:ring-green-500 block w-full sm:text-sm focus:ring-1 rounded-lg ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="이메일을 입력해주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </label>
        </div>

        <div className="mb-6 relative">
          <label>
            <input
              type="password"
              name="password"
              className={`mt-1 px-3 py-2 bg-white border focus:outline-none focus:border-green-500 focus:ring-green-500 block w-full sm:text-sm focus:ring-1 rounded-lg ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </label>
          {errors.login && (
            <p className="text-red-500 text-sm mt-1">{errors.login}</p>
          )}
        </div>

        <div className="mb-6 relative flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="ml-2 text-sm">자동로그인</label>
          </div>
          <span className="text-green-600 text-sm hover:cursor-pointer hover:underline">
            비밀번호 찾기
          </span>
        </div>

        <button
          className="w-full py-5 bg-green-500 hover:bg-green-700 text-white font-bold rounded-full transition-all"
          onClick={handleLogin}
        >
          로그인
        </button>
      </div>

      <div className="mt-4 text-center text-sm text-gray-700">
        <span>Meeting Minutes 처음이신가요? </span>
        <Link to="/signup" className="text-green-600 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
