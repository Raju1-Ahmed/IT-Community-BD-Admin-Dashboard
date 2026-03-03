import { useEffect, useState } from "react";
import api from "../api";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/applications");
        setApplications(data.applications || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading applications...</p>;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">Applications</h2>
      <p className="mt-1 text-sm text-slate-600">Total: {applications.length}</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2">Candidate</th>
              <th className="p-2">Candidate Email</th>
              <th className="p-2">Job Title</th>
              <th className="p-2">Company</th>
              <th className="p-2">Status</th>
              <th className="p-2">Applied</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item) => (
              <tr key={item._id} className="border-t border-slate-200">
                <td className="p-2">{item.candidate?.name || "N/A"}</td>
                <td className="p-2">{item.candidate?.email || "N/A"}</td>
                <td className="p-2">{item.job?.title || "N/A"}</td>
                <td className="p-2">{item.job?.companyName || "N/A"}</td>
                <td className="p-2">{item.status || "pending"}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ApplicationsPage;
