import React, { useCallback, useEffect, useState } from "react";
import { setLoggedIn } from "../store/Reducers/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Get_Token, Remove_Token, Server_url } from "../helper/helper";
import axios from "axios";

const LoadingPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Memoize the GetUserDatafromServer function using useCallback
  const GetUserDatafromServer = useCallback(
    async (token) => {
      try {
        const res = await axios.post(
          `${Server_url}/get-admin-info`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(setLoggedIn({ user: res.data.data }));
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        Remove_Token();
        navigate("/login");
      }
    },
    [dispatch, navigate]
  );

  // Handle redirection logic after loading state is false
  useEffect(() => {
    const token = Get_Token();
    if (!loading) {
      if (token) {
        if (user || isLoggedIn) {
          navigate("/dashboard");
        } else {
          GetUserDatafromServer(token);
        }
      } else {
        navigate("/login");
      }
    }
  }, [navigate, user, isLoggedIn, loading, GetUserDatafromServer]);

  // Simulate loading delay for 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div id="bg-wrap" className="overflow-hidden w-full h-full">
      <div
        className={`flex items-center flex-col justify-center text-xl rounded-lg absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] transition-all w-[500px] max-w-[80%] h-[200px] bg-[#0f0f0f2b] font-extrabold font-AUS text-[#eaeaea] backdrop-blur-lg ${
          !loading && "transition-effect"
        }`}
      >
        <div className="transition-all animate-typewriter w-full text-center">
          Technocity network Billing v0.1.0
        </div>

        <div
          className={`text-sm absolute bottom-[20px] transition-all font-mono font-extralight text-gray-600 ${
            loading && "opacity-0"
          }`}
        >
          Loading Please Wait or Check your internet connection
        </div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient
            id="Gradient1"
            cx="50%"
            cy="50%"
            fx="0.441602%"
            fy="50%"
            r=".5"
          >
            <animate
              attributeName="fx"
              dur="34s"
              values="0%;3%;0%"
              repeatCount="indefinite"
            ></animate>
            <stop offset="0%" stop-color="#cedbd2"></stop>
            <stop offset="100%" stop-color="rgba(255, 0, 255, 0)"></stop>
          </radialGradient>
          <radialGradient
            id="Gradient2"
            cx="50%"
            cy="50%"
            fx="2.68147%"
            fy="50%"
            r=".5"
          >
            <animate
              attributeName="fx"
              dur="23.5s"
              values="0%;3%;0%"
              repeatCount="indefinite"
            ></animate>
            <stop offset="0%" stop-color="#c4f5d4"></stop>
            <stop offset="100%" stop-color="rgba(255, 255, 0, 0)"></stop>
          </radialGradient>
          <radialGradient
            id="Gradient3"
            cx="50%"
            cy="50%"
            fx="0.836536%"
            fy="50%"
            r=".5"
          >
            <animate
              attributeName="fx"
              dur="21.5s"
              values="0%;3%;0%"
              repeatCount="indefinite"
            ></animate>
            <stop offset="0%" stop-color="rgba(0, 255, 255, 1)"></stop>
            <stop offset="100%" stop-color="rgba(0, 255, 255, 0)"></stop>
          </radialGradient>
          <radialGradient
            id="Gradient4"
            cx="50%"
            cy="50%"
            fx="4.56417%"
            fy="50%"
            r=".5"
          >
            <animate
              attributeName="fx"
              dur="23s"
              values="0%;5%;0%"
              repeatCount="indefinite"
            ></animate>
            <stop offset="0%" stop-color="#d3f5de"></stop>
            <stop offset="100%" stop-color="rgba(0, 255, 0, 0)"></stop>
          </radialGradient>
          <radialGradient
            id="Gradient5"
            cx="50%"
            cy="50%"
            fx="2.65405%"
            fy="50%"
            r=".5"
          >
            <animate
              attributeName="fx"
              dur="24.5s"
              values="0%;5%;0%"
              repeatCount="indefinite"
            ></animate>
            <stop offset="0%" stop-color="#cedbd2"></stop>
            <stop offset="100%" stop-color="rgba(0,0,255, 0)"></stop>
          </radialGradient>
          <radialGradient
            id="Gradient6"
            cx="50%"
            cy="50%"
            fx="0.981338%"
            fy="50%"
            r=".5"
          >
            <animate
              attributeName="fx"
              dur="25.5s"
              values="0%;5%;0%"
              repeatCount="indefinite"
            ></animate>
            <stop offset="0%" stop-color="#a7b0aa"></stop>
            <stop offset="100%" stop-color="rgba(255,0,0, 0)"></stop>
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient4)">
          <animate
            attributeName="x"
            dur="20s"
            values="25%;0%;25%"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            dur="21s"
            values="0%;25%;0%"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="17s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient5)">
          <animate
            attributeName="x"
            dur="23s"
            values="0%;-25%;0%"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            dur="24s"
            values="25%;-25%;25%"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="18s"
            repeatCount="indefinite"
          />
        </rect>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#Gradient6)">
          <animate
            attributeName="x"
            dur="25s"
            values="-25%;0%;-25%"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            dur="26s"
            values="0%;-25%;0%"
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 50 50"
            to="0 50 50"
            dur="19s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="13.744%"
          y="1.18473%"
          width="100%"
          height="100%"
          fill="url(#Gradient1)"
          transform="rotate(334.41 50 50)"
        >
          <animate
            attributeName="x"
            dur="20s"
            values="25%;0%;25%"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="y"
            dur="21s"
            values="0%;25%;0%"
            repeatCount="indefinite"
          ></animate>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="7s"
            repeatCount="indefinite"
          ></animateTransform>
        </rect>
        <rect
          x="-2.17916%"
          y="35.4267%"
          width="100%"
          height="100%"
          fill="url(#Gradient2)"
          transform="rotate(255.072 50 50)"
        >
          <animate
            attributeName="x"
            dur="23s"
            values="-25%;0%;-25%"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="y"
            dur="24s"
            values="0%;50%;0%"
            repeatCount="indefinite"
          ></animate>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="12s"
            repeatCount="indefinite"
          ></animateTransform>
        </rect>
        <rect
          x="9.00483%"
          y="14.5733%"
          width="100%"
          height="100%"
          fill="url(#Gradient3)"
          transform="rotate(139.903 50 50)"
        >
          <animate
            attributeName="x"
            dur="25s"
            values="0%;25%;0%"
            repeatCount="indefinite"
          ></animate>
          <animate
            attributeName="y"
            dur="12s"
            values="0%;25%;0%"
            repeatCount="indefinite"
          ></animate>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 50 50"
            to="0 50 50"
            dur="9s"
            repeatCount="indefinite"
          ></animateTransform>
        </rect>
      </svg>
    </div>
  );
};

export default LoadingPage;

// yaar user ka form banana he jis me hogi aik user ki id user id Hum Enter kAre Ge ur user ka user name ur phir pakckage kona he matlab kitni mb wala us me nuber likhne us me sirf number likh sake ur sath hi me us input ke sath drop down bhi lagana he ke mb ya gb select ka default mb select hogi phir aye ga package ka pricee kitnahe phir aye ga
