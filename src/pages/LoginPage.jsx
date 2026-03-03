import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import brandLogo from "../assets/brand-logo.svg";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.user?.role !== "admin") {
        localStorage.removeItem("admin_token");
        setError("Only admin accounts can access this dashboard.");
        return;
      }
      localStorage.setItem("admin_token", data.token);
      navigate("/");
    } catch (err) {
      localStorage.removeItem("admin_token");
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <img src={brandLogo} alt="IT Community Bangladesh" className="mb-4 h-10 w-auto" />
        <h1 className="text-2xl font-bold">Admin Dashboard Login</h1>
        <p className="mt-1 text-sm text-slate-600">Use your admin account credentials.</p>

        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-md border p-2"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-md border p-2"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="w-full rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
