import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import sidebarReducer from "./components/sidebar/sidebarReducer";
import "./App.css";

import Sidebar from "./components/sidebar/sidebar";
import Main from "./components/contents/main/main";
import Minutes from "./components/contents/minutes/minutes";
import MyMinutes from "./components/contents/my_minutes/myMinutes";
import LoginPage from "./components/contents/login/loginPage";
import AuthCheck from "./components/contents/login/authCheck";
import SignupPage from "./components/contents/login/signup";

const store = createStore(sidebarReducer);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthCheck />
        <div className="flex w-full mx-auto bg-white">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/minutes" element={<Minutes />} />
            <Route path="/myMinutes" element={<MyMinutes />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
