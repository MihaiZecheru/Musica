import { useEffect } from "react";
import supabase from "../config/supabase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.signOut();
      } catch (error) {};
      navigate('/login');
    })();
  }, []);

  return (
    <div>Logging out...</div>
  );
}
 
export default Logout;