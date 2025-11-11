// import { useMsal } from '@azure/msal-react'; // SSO (to be enabled later)
import Button from '../../../shared/components/Button/Button';
// import { loginRequest } from '../../../auth/msal';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SignInButton(): JSX.Element {
  // const { instance, accounts } = useMsal();
  // const isSignedIn = accounts.length > 0;
  const isSignedIn = typeof localStorage !== 'undefined' && localStorage.getItem('auth') === '1';
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const signIn = async () => {
    // await instance.loginRedirect(loginRequest); // SSO sign-in (later)
    localStorage.setItem('auth', '1');
    const role = params.get('role') || 'User';
    localStorage.setItem('role', role);
    navigate('/dashboard');
  };

  return (
    <Button onClick={signIn} disabled={isSignedIn}>
      {isSignedIn ? 'Signed in' : 'SSO Sign in'}
    </Button>
  );
}


