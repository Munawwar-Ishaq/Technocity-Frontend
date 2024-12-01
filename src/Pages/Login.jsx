import {
  faCheck,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginApi } from "../store/Reducers/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [error, setError] = useState({
    username: false,
    password: false,
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  // Dispatch
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // Handle User Login
  const handleLoginUser = () => {
    if (!username) {
      setError((err) => ({ ...err, username: true }));
      return toast.error("Please enter a username");
    }
    if (!password) {
      setError((err) => ({ ...err, password: true }));
      return toast.error("Please enter a password");
    }

    setError((err) => ({ username: false, password: false }));
    dispatch(loginApi({ username: username, password: password }));
  };

  return (
    <div
      className="w-full select-none h-screen bg-blend-multiply flex items-center justify-center bg-[#000000c4]"
      style={{
        backgroundImage: `url(${require("../assets/login-bg.png")})`,
      }}
    >
      <div className="w-[370px] h-[450px] rounded-md overflow-hidden backdrop-blur-lg relative py-4 bg-[#ffffff2c]">
        {loading && (
          <div
            className="absolute w-full h-full bg-[#ffffff5a] top-0 pointer-events-auto z-10 "
            onClick={(e) => e.stopPropagation()}
          ></div>
        )}
        <h2 className="uppercase font-medium text-xl text-center mb-10 text-[#e2e2e2]">
          Login to your Account
        </h2>
        <div className="w-full flex flex-col gap-3 px-3 mb-10 relative">
          <span className="text-[#e2e2e2] font-light tracking-wide ">
            Username
          </span>
          <input
            type="text"
            value={username}
            style={{
              borderBottom: `1px solid ${
                error.username ? "#e35146" : "#b2b2b2"
              }`,
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                document.body.querySelector("#password").focus();
                document.body.querySelector("#password").setSelectionRange(password.length, password.length);

              }
            }}
            onChange={(e) => {
              setUsername(e.target.value);
              if (username) {
                setError((err) => ({ ...err, username: false }));
              }
            }}
            className={`bg-transparent border-b ${
              error.username
                ? "placeholder:text-[#e35146]"
                : "placeholder:text-[gray]"
            } placeholder:font-light px-1 outline-none py-1 text-sm text-[#e2e2e2] `}
            placeholder="Enter here.. "
          />
          {error.username && (
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="absolute right-[11px] text-red-500 bottom-[5px]"
            />
          )}
        </div>
        <div className="w-full flex flex-col gap-3 px-3 mb-4 relative">
          <span className="text-[#e2e2e2] font-light tracking-wide">
            Password
          </span>
          <input
            type={showPass ? "text" : "password"}
            value={password}
            id="password"
            onChange={(e) => {
              setPassword(e.target.value);
              if (password) {
                setError((err) => ({ ...err, password: false }));
              }
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleLoginUser();
              }
            }}
            style={{
              borderBottom: `1px solid ${
                error.password ? "#e35146" : "#b2b2b2"
              }`,
            }}
            className={`bg-transparent border-b ${
              error.password
                ? "placeholder:text-[#e35146]"
                : "placeholder:text-[gray]"
            } placeholder:font-light px-1 outline-none py-1 text-sm text-[#e2e2e2] `}
            placeholder="Enter here.. "
          />
          {error.password && (
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="absolute right-[11px] text-red-500 bottom-[5px]"
            />
          )}
        </div>
        <div className="flex items-center gap-2 px-3">
          <div
            className="w-[17px] h-[17px] border border-gray-300 cursor-pointer rounded-sm"
            onClick={() => setShowPass((prev) => !prev)}
          >
            <div
              className={`w-full h-full flex items-center justify-center ${
                showPass ? "scale-100" : "scale-0"
              } transition-all  text-[10px]  text-[#e2e2e2]`}
            >
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </div>
          <div className="text-[#e2e2e2] font-light">Show Password</div>
        </div>
        <div
          className="bg-[#e2e2e2] mt-[50px] h-[30px] flex items-center justify-center text-sm py-1 font-bold rounded-full cursor-pointer hover:bg-[#c4c3c3] transition-all text-[#3b3b3b] mx-auto w-[calc(100%-24px)]"
          onClick={handleLoginUser}
        >
          {loading ? <div class="loader1-spin"></div> : "Login"}
        </div>
      </div>
    </div>
  );
};

export default Login;
