import { useContext, useEffect, useState } from "react"
import { UserContext } from './../context/UserContext';
import { useNavigate } from "react-router-dom";
import axiosInstance from './../utils/axiosinstance';
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth =()=>{
    const {user,updateUser,clearUser} =useContext(UserContext);
    const navigate =useNavigate();
// 💡 1. Add loading state, initialized to true
  const [authLoading, setAuthLoading] = useState(true);
    useEffect(()=>{
        if(user){
            setAuthLoading(false);//sel loading to false if user exists
            return;
        }

        let isMounted=true;
        setAuthLoading(true);

        const fetchUserInfo =async ()=>{
            try {
                const response=await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO)
                if(isMounted && response.data){
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info :",error);
                if(isMounted){
                    clearUser();
                    navigate("/login")
                }
            }finally{
                if(isMounted){
                    setAuthLoading(false);
                }
            }
        }

        fetchUserInfo();

        return ()=>{
            isMounted=false;
        }

    },[user,updateUser,clearUser,navigate])
    return {user,authLoading};
}