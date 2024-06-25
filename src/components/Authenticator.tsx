import React, { useEffect, useState } from 'react';
import supabase from '../config/supabase';
import { useNavigate } from 'react-router-dom';

const Authenticator = ({ component }: { component: React.ReactNode}) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error(error.message);
        throw error;
      }

      if (!data.user) navigate('/login');
      else setUser(data.user);
    })();
  }, [navigate]);

  return (
    <>
      { user && component }
    </>
  );
}
 
export default Authenticator;