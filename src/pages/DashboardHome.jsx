import { useEffect, useState } from "react";
import api from "../api";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState("");
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });

  const getErrorMessage = (error, fallback) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return fallback;
  };

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, contactsRes, adminRes, meRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/contact-messages"),
        api.get("/admin/users?role=admin"),
        api.get("/auth/me")
      ]);
      setStats(statsRes.data.stats || {});
      setContacts((contactsRes.data.messages || []).slice(0, 10));
      setAdmins(adminRes.data.users || []);
      setCurrentAdminId(meRes?.data?.user?.id || "");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to load admin data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createAdmin = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (adminForm.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    try {
      setCreatingAdmin(true);
      await api.post("/admin/create-admin", adminForm);
      setSuccessMessage("New admin created successfully.");
      setAdminForm({ name: "", email: "", password: "" });
      await load();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to create admin."));
    } finally {
      setCreatingAdmin(false);
    }
  };

  const deleteAdmin = async (admin) => {
    setSuccessMessage("");
    setErrorMessage("");
    const ok = window.confirm(`Delete admin ${admin.email}?`);
    if (!ok) return;

    try {
      setDeletingAdminId(admin._id);
      await api.delete(`/admin/users/${admin._id}`);
      setSuccessMessage("Admin deleted successfully.");
      await load();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to delete admin."));
    } finally {
      setDeletingAdminId("");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-2xl font-bold">Website Owner Panel</h2>
        <p className="mt-1 text-sm text-slate-600">Central control for jobs, users, applications, premium and contacts.</p>
        {successMessage ? <p className="mt-2 text-sm text-emerald-700">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-2 text-sm text-red-600">{errorMessage}</p> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
        <Stat label="Users" value={stats?.users} />
        <Stat label="Employers" value={stats?.employers} />
        <Stat label="Seekers" value={stats?.seekers} />
        <Stat label="Jobs" value={stats?.jobs} />
        <Stat label="Active Jobs" value={stats?.activeJobs} />
        <Stat label="Applications" value={stats?.applications} />
        <Stat label="Contacts" value={stats?.contactMessages} />
        <Stat label="Premium Pending" value={stats?.premiumPendingReview} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-semibold">Create New Admin</h3>
        <form onSubmit={createAdmin} className="mt-3 grid gap-2 md:grid-cols-4">
          <input
            className="rounded-md border p-2"
            placeholder="Name"
            value={adminForm.name}
            onChange={(e) => setAdminForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            className="rounded-md border p-2"
            type="email"
            placeholder="Email"
            value={adminForm.email}
            onChange={(e) => setAdminForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <input
            className="rounded-md border p-2"
            type="password"
            placeholder="Password"
            value={adminForm.password}
            onChange={(e) => setAdminForm((p) => ({ ...p, password: e.target.value }))}
            minLength={6}
            required
          />
          <button
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={creatingAdmin}
          >
            {creatingAdmin ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-semibold">Admin Accounts</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Joined</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id} className="border-t border-slate-200">
                  <td className="p-2">{admin.name}</td>
                  <td className="p-2">{admin.email}</td>
                  <td className="p-2">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">
                    {admin._id === currentAdminId ? (
                      <span className="text-xs text-slate-500">Current admin</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => deleteAdmin(admin)}
                        disabled={deletingAdminId === admin._id}
                        className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {deletingAdminId === admin._id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-xl font-semibold">Recent Contact Messages</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Subject</th>
                <th className="p-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id} className="border-t border-slate-200">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.email}</td>
                  <td className="p-2">{c.subject || "N/A"}</td>
                  <td className="p-2 max-w-sm truncate" title={c.message}>{c.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-4">
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 text-2xl font-bold text-slate-900">{value ?? 0}</p>
  </article>
);

export default DashboardHome;
