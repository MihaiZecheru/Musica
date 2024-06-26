import React, { useEffect, useState } from 'react';
import supabase from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import GetUser from '../functions/GetUser';

const Authenticator = ({ component }: { component: React.ReactNode}) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await GetUser();

      if (!user) navigate('/login');
      else setUser(user);
    })();
  }, [navigate]);

  return (
    <>
      { user && component }
    </>
  );
}
 
export default Authenticator;