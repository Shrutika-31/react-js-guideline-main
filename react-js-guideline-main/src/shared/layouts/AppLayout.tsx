// import { useMsal } from '@azure/msal-react'; // SSO (to be enabled later)
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AppLayout({ children }: { children: ReactNode }): JSX.Element {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  // const { instance, accounts } = useMsal();
  // const account = accounts[0];
  // const displayName = account?.name || 'User';
  const role = typeof localStorage !== 'undefined' ? localStorage.getItem('role') || 'User' : 'User';
  const displayName = role === 'HR' ? 'HR Approver' : 'User';
  const authed = typeof localStorage !== 'undefined' && localStorage.getItem('auth') === '1';
  const initials = (displayName.match(/\b\w/g) || []).slice(0, 2).join('').toUpperCase();

  const logout = async () => {
    setMenuOpen(false);
    // await instance.logoutRedirect(); // SSO logout (later)
    localStorage.removeItem('auth');
    localStorage.removeItem('role');
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {authed && (
              <button
                type="button"
                className="border border-gray-200 bg-white rounded-lg px-2 py-1.5 cursor-pointer hover:bg-gray-50"
                aria-label="Toggle sidebar"
                onClick={() => setCollapsed(prev => !prev)}
              >
                ☰
              </button>
            )}
            <div className="font-extrabold">Unified Hiring Portal</div>
          </div>
          {authed ? (
            <nav className="flex items-center">
              <input
                className="w-[360px] max-w-[36vw] mr-3 px-3 py-2 border border-gray-200 rounded-full"
                placeholder="Search candidates, jobs, clients..."
              />
              <button type="button" className="mr-2 px-3 py-1.5 border border-gray-200 rounded-full bg-white cursor-pointer hover:bg-gray-50" title="Notifications" aria-label="Notifications">
                🔔
              </button>
              <div className="flex items-center gap-2.5 ml-4 relative cursor-pointer" onClick={() => setMenuOpen(v => !v)}>
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center" aria-hidden>
                  {initials || 'U'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-900">{displayName}</div>
                  {role === 'HR' ? (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-semibold">HR</span>
                  ) : null}
                </div>
                {menuOpen && (
                  <div className="absolute top-[120%] right-0 w-[200px] bg-white border border-gray-200 rounded-lg shadow-xl p-2" role="menu">
                    <button className="block w-full text-left bg-transparent border-none py-2.5 px-2 rounded-lg cursor-pointer hover:bg-gray-50" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Profile Settings
                    </button>
                    <button className="block w-full text-left bg-transparent border-none py-2.5 px-2 rounded-lg cursor-pointer hover:bg-gray-50 text-red-700" role="menuitem" onClick={logout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          ) : (
            <div />
          )}
        </div>
      </header>

      {authed && (
      <aside className={`fixed top-14 bottom-0 left-0 bg-white border-r border-gray-200 ${collapsed ? 'w-16 px-2' : 'w-[220px] px-3'} pt-3`}>
        <div className="space-y-3">
          <div>
            {!collapsed && <div className="text-xs text-gray-500 mb-1.5">Main</div>}
            <div className="space-y-1">
              <Link to="/dashboard" className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 no-underline cursor-pointer hover:bg-gray-50">
                <span className="w-5 text-center" aria-hidden>📊</span>
                {!collapsed && <span>Dashboard</span>}
              </Link>
              <Link to="/requisitions" className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 no-underline cursor-pointer hover:bg-gray-50">
                <span className="w-5 text-center" aria-hidden>📄</span>
                {!collapsed && <span>Requisitions</span>}
              </Link>
              <Link to="/requisitions/new" className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 no-underline cursor-pointer hover:bg-gray-50">
                <span className="w-5 text-center" aria-hidden>➕</span>
                {!collapsed && <span>New Requisition</span>}
              </Link>
              <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50" type="button">
                <span className="w-5 text-center" aria-hidden>🔁</span>
                {!collapsed && <span>Pipeline</span>}
              </button>
              <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50" type="button">
                <span className="w-5 text-center" aria-hidden>🎤</span>
                {!collapsed && <span>Interviews</span>}
              </button>
              <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50" type="button">
                <span className="w-5 text-center" aria-hidden>👥</span>
                {!collapsed && <span>Clients</span>}
              </button>
              <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50" type="button">
                <span className="w-5 text-center" aria-hidden>📦</span>
                {!collapsed && <span>Templates</span>}
              </button>
              <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50" type="button">
                <span className="w-5 text-center" aria-hidden>📈</span>
                {!collapsed && <span>Analytics</span>}
              </button>
              <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50" type="button">
                <span className="w-5 text-center" aria-hidden>⚙️</span>
                {!collapsed && <span>Settings</span>}
              </button>
            </div>
          </div>
          <div>
            {!collapsed && <div className="text-xs text-gray-500 mb-1.5">Quick Actions</div>}
            <div className="space-y-1">
              <Link to="/requisitions/new" className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 no-underline cursor-pointer hover:bg-gray-50">
                <span className="w-5 text-center" aria-hidden>📝</span>
                {!collapsed && <span>Create Requisition</span>}
              </Link>
              <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50" type="button">
                <span className="w-5 text-center" aria-hidden>📄</span>
                {!collapsed && <span>Bulk Upload CV</span>}
              </button>
            </div>
          </div>
          <div>
            {!collapsed && <div className="text-xs text-gray-500 mb-1.5">Account</div>}
            <button className="flex items-center gap-2.5 w-full text-left py-2 px-2.5 rounded-lg border border-transparent bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50 justify-center" type="button" onClick={logout}>
              <span className="w-5 text-center" aria-hidden>🚪</span>
              {!collapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </aside>
      )}

      <main className={`pt-[76px] px-5 pb-6 ${authed ? (collapsed ? 'ml-16' : 'ml-[220px]') : 'ml-0'}`}>
        {children}
      </main>
    </div>
  );
}
