import { useEffect } from "react";
import supabase from "../config/supabase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    (async () => {
      await supabase.auth.signOut();
      navigate('/login');
    })();
  }, []);

  return (
    <div>Logging out...</div>
  );
}
 
export default Logout;