import { Navigate, NavLink, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmployersPage from "./pages/EmployersPage";
import SeekersPage from "./pages/SeekersPage";
import JobsPage from "./pages/JobsPage";
import ActiveJobsPage from "./pages/ActiveJobsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ContactsPage from "./pages/ContactsPage";
import PremiumPendingPage from "./pages/PremiumPendingPage";
import AdminsPage from "./pages/AdminsPage";
import brandLogo from "./assets/brand-logo.svg";

const Protected = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const menuItems = [
  { label: "Employers", to: "/employers", icon: "employers" },
  { label: "Seekers", to: "/seekers", icon: "seekers" },
  { label: "Jobs", to: "/jobs", icon: "jobs" },
  { label: "Active Jobs", to: "/active-jobs", icon: "activeJobs" },
  { label: "Applications", to: "/applications", icon: "applications" },
  { label: "Contacts", to: "/contacts", icon: "contacts" },
  { label: "Premium Pending", to: "/premium-pending", icon: "premiumPending" },
  { label: "Admins", to: "/admins", icon: "admin" }
];

const UserShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4.5 6v5.5c0 5 3.3 8.2 7.5 9.5 4.2-1.3 7.5-4.5 7.5-9.5V6L12 3Z" />
    <circle cx="12" cy="10" r="2.2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.8 15.2a4.4 4.4 0 0 1 6.4 0" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m16 17 5-5-5-5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H9" />
  </svg>
);

const MenuIcon = ({ type }) => {
  const className = "h-4 w-4";

  if (type === "employers") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 5v3h6V5" />
      </svg>
    );
  }
  if (type === "seekers") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <circle cx="12" cy="8" r="3" />
        <path d="M6 19a6 6 0 0 1 12 0" />
      </svg>
    );
  }
  if (type === "jobs") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path d="M4 7h16v12H4z" />
        <path d="M9 7V5h6v2" />
      </svg>
    );
  }
  if (type === "activeJobs") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="m9.5 12.5 1.8 1.8 3.6-3.6" />
      </svg>
    );
  }
  if (type === "applications") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path d="M7 4h8l4 4v12H7z" />
        <path d="M15 4v4h4M10 13h6M10 17h6" />
      </svg>
    );
  }
  if (type === "contacts") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  if (type === "premiumPending") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    );
  }
  return <UserShieldIcon />;
};

const Shell = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="flex min-h-screen w-72 flex-col border-r border-slate-200 bg-white p-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={brandLogo} alt="IT Community Bangladesh" className="h-9 w-auto" />
              <h1 className="text-lg font-bold text-slate-900">Admin</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500">Users admin panel</p>

            <nav className="mt-5 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                      isActive ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <MenuIcon type={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <button
            onClick={logout}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </aside>

        <div className="flex-1 p-5 md:p-6">
          <div className="mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-2">
              <img src={brandLogo} alt="IT Community Bangladesh" className="h-7 w-auto" />
              <p className="text-sm text-slate-600">IT Community Bangladesh</p>
            </div>
            <p className="text-xl font-bold text-slate-900">Admin Dashboard</p>
          </div>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <Shell />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/employers" replace />} />
        <Route path="employers" element={<EmployersPage />} />
        <Route path="seekers" element={<SeekersPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="active-jobs" element={<ActiveJobsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="premium-pending" element={<PremiumPendingPage />} />
        <Route path="admins" element={<AdminsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/employers" replace />} />
    </Routes>
  );
};

export default App;
