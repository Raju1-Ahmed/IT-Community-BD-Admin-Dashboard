import { useEffect, useState } from "react";
import api from "../api";

const EmployersPage = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/users?role=employer");
        setEmployers(data.users || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load employers.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading employers...</p>;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">Employers</h2>
      <p className="mt-1 text-sm text-slate-600">Total: {employers.length}</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Company</th>
              <th className="p-2">Location</th>
              <th className="p-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((item) => (
              <tr key={item._id} className="border-t border-slate-200">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.email}</td>
                <td className="p-2">{item.companyName || "N/A"}</td>
                <td className="p-2">{item.location || "N/A"}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EmployersPage;
