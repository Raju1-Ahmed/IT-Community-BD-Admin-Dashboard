import { useEffect, useState } from "react";
import api from "../api";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/jobs");
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading jobs...</p>;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">Jobs</h2>
      <p className="mt-1 text-sm text-slate-600">Total: {jobs.length}</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Company</th>
              <th className="p-2">Posted By</th>
              <th className="p-2">Location</th>
              <th className="p-2">Status</th>
              <th className="p-2">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} className="border-t border-slate-200">
                <td className="p-2">{job.title}</td>
                <td className="p-2">{job.companyName}</td>
                <td className="p-2">{job.postedBy?.email || "N/A"}</td>
                <td className="p-2">{job.location || "N/A"}</td>
                <td className="p-2">
                  <span className={`rounded px-2 py-0.5 text-xs ${job.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {job.status}
                  </span>
                </td>
                <td className="p-2">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default JobsPage;
