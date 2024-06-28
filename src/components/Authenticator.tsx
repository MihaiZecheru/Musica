import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GetUser from '../functions/GetUser';
import { User } from '@supabase/supabase-js';
import Navbar from './Navbar';

interface Props {
  component: React.ReactNode;
}

const Authenticator = ({ component }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await GetUser();

      if (!user) navigate('/login');
      else setUser(user);
    })();
  }, []);

  return (
    <>
      {user && <Navbar />}
      {user && component}
    </>
  );
}
 
export default Authenticator;