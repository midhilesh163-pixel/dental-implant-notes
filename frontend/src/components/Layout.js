import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { House, Users, ChartLine, Buildings, SignOut } from '@phosphor-icons/react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: House },
    { path: '/patients', label: 'Patients', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: ChartLine },
    { path: '/clinics', label: 'Clinics', icon: Buildings }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F8] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F0F0EE] border-r border-[#E5E5E2] hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-[#2A2F35] tracking-tight">DentalHub</h1>
          <p className="text-xs text-[#5C6773] mt-1">Implant Management</p>
        </div>
        
        <nav className="px-3 mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors duration-200 ${
                  isActive
                    ? 'bg-white text-[#2A2F35] shadow-sm'
                    : 'text-[#5C6773] hover:bg-white/50'
                }`}
              >
                <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-[#E5E5E2]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#82A098] flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2A2F35] truncate">{user?.name}</p>
              <p className="text-xs text-[#5C6773] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            data-testid="logout-button"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E5E5E2] rounded-lg text-[#5C6773] text-sm hover:bg-[#F9F9F8] transition-colors duration-200"
          >
            <SignOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;