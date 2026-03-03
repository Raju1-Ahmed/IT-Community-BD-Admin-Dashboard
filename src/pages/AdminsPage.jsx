import { useEffect, useState } from "react";
import api from "../api";

const AdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const getError = (err, fallback) => err?.response?.data?.message || err?.message || fallback;

  const load = async () => {
    setLoading(true);
    try {
      const [adminsRes, meRes] = await Promise.all([api.get("/admin/users?role=admin"), api.get("/auth/me")]);
      setAdmins(adminsRes.data.users || []);
      setCurrentAdminId(meRes?.data?.user?.id || "");
      setError("");
    } catch (err) {
      setError(getError(err, "Failed to load admin accounts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createAdmin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setCreating(true);
      await api.post("/admin/create-admin", form);
      setForm({ name: "", email: "", password: "" });
      setMessage("New admin created successfully.");
      await load();
    } catch (err) {
      setError(getError(err, "Failed to create admin."));
    } finally {
      setCreating(false);
    }
  };

  const deleteAdmin = async (admin) => {
    setMessage("");
    setError("");
    if (!window.confirm(`Delete admin ${admin.email}?`)) return;

    try {
      setDeletingId(admin._id);
      await api.delete(`/admin/users/${admin._id}`);
      setMessage("Admin deleted successfully.");
      await load();
    } catch (err) {
      setError(getError(err, "Failed to delete admin."));
    } finally {
      setDeletingId("");
    }
  };

  if (loading) return <p>Loading admin accounts...</p>;

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold text-slate-900">Admin Accounts</h2>
        <p className="mt-1 text-sm text-slate-600">Total: {admins.length}</p>
        {message ? <p className="mt-2 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Create New Admin</h3>
        <form onSubmit={createAdmin} className="mt-3 grid gap-2 md:grid-cols-4">
          <input
            className="rounded-md border p-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            className="rounded-md border p-2"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            className="rounded-md border p-2"
            type="password"
            minLength={6}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {creating ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">All Admins</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
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
                        disabled={deletingId === admin._id}
                        className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {deletingId === admin._id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminsPage;
