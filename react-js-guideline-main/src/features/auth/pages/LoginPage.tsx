import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'HR' | 'User' | null>(null);

  function signIn(): void {
    if (!selectedRole) return;
    localStorage.setItem('auth', '1');
    localStorage.setItem('role', selectedRole);
    navigate('/dashboard');
  }

  return (
    <section className="min-h-[calc(100vh-56px)] grid place-items-center bg-[linear-gradient(180deg,#f8fafc,rgba(248,250,252,0)),radial-gradient(1000px_200px_at_50%_-100px,rgba(79,70,229,0.06),transparent)]">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 w-[min(440px,92vw)] shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold grid place-items-center">U</div>
          <h2 className="mt-3 mb-1">Welcome back</h2>
          <p className="text-gray-500 m-0 text-sm">Sign in to Unified Hiring Portal</p>
          {selectedRole === 'HR' ? (
            <p className="text-blue-600 font-semibold text-sm mt-2">HR Approver Selected</p>
          ) : selectedRole === 'User' ? (
            <p className="text-gray-600 font-semibold text-sm mt-2">Regular User Selected</p>
          ) : null}
        </div>
        <div className="mt-6 grid gap-3">
          {!selectedRole ? (
            <>
              <Button onClick={() => setSelectedRole('HR')} className="w-full">
                HR Approver
              </Button>
              <Button onClick={() => setSelectedRole('User')} className="w-full">
                User
              </Button>
            </>
          ) : (
            <>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm">
                Selected: <span className="font-semibold">{selectedRole === 'HR' ? 'HR Approver' : 'Regular User'}</span>
              </div>
              <Button onClick={signIn} className="w-full">SSO Sign in</Button>
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Change Role
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}


