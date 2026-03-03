import { useEffect, useMemo, useState } from "react";
import api from "../api";

const ActiveJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/jobs");
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load active jobs.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const activeJobs = useMemo(() => jobs.filter((job) => job.status === "active"), [jobs]);

  if (loading) return <p>Loading active jobs...</p>;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">Active Jobs</h2>
      <p className="mt-1 text-sm text-slate-600">Total: {activeJobs.length}</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2">Title</th>
              <th className="p-2">Company</th>
              <th className="p-2">Location</th>
              <th className="p-2">Employment</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {activeJobs.map((job) => (
              <tr key={job._id} className="border-t border-slate-200">
                <td className="p-2">{job.title}</td>
                <td className="p-2">{job.companyName}</td>
                <td className="p-2">{job.location || "N/A"}</td>
                <td className="p-2">{job.employmentStatus || "N/A"}</td>
                <td className="p-2">{job.salaryRange || "N/A"}</td>
                <td className="p-2">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ActiveJobsPage;
