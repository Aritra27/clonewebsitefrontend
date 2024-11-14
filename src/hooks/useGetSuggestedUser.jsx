import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetSuggestedUser = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/suggested `, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSuggestedUser();
    }, [])
};
export default useGetSuggestedUser