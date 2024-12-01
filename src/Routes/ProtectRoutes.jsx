import React, { useEffect, useState, useCallback } from "react";
import { Get_Token, Remove_Token, Server_url } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLoggedIn } from "../store/Reducers/auth";

const ProtectRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Memoize GetUserDatafromServer using useCallback
  const GetUserDatafromServer = useCallback(async (token) => {
    try {
      const res = await axios.post(
        `${Server_url}/get-admin-info`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setLoggedIn({ user: res.data.data }));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      Remove_Token();
      navigate("/login");
      setIsLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = Get_Token();
    if (!token) {
      navigate("/login");
      setIsLoading(false);
    } else if (!user && !isLoggedIn) {
      GetUserDatafromServer(token);
    } else {
      setIsLoading(false); 
    }
  }, [navigate, user, isLoggedIn, GetUserDatafromServer]);

  return isLoading ? <div>Loading...</div> : <>{children}</>;
};

export default ProtectRoute;
