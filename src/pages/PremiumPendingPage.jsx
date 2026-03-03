import { useEffect, useState } from "react";
import api from "../api";

const PremiumPendingPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/premium/admin/queue?status=pending_review");
        setProfiles(data.profiles || []);
        setPayments(data.payments || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load premium pending data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading premium pending data...</p>;

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-bold text-slate-900">Premium Pending</h2>
        <p className="mt-1 text-sm text-slate-600">Profiles waiting for review: {profiles.length}</p>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2">Seeker</th>
                <th className="p-2">Email</th>
                <th className="p-2">Location</th>
                <th className="p-2">Headline</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((item) => (
                <tr key={item._id} className="border-t border-slate-200">
                  <td className="p-2">{item.seeker?.name || "N/A"}</td>
                  <td className="p-2">{item.seeker?.email || "N/A"}</td>
                  <td className="p-2">{item.seeker?.location || "N/A"}</td>
                  <td className="p-2">{item.headline || "N/A"}</td>
                  <td className="p-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Submitted Payments</h3>
        <p className="mt-1 text-sm text-slate-600">Payments waiting for verification: {payments.length}</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2">Seeker</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Method</th>
                <th className="p-2">Reference</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-t border-slate-200">
                  <td className="p-2">{payment.seeker?.email || "N/A"}</td>
                  <td className="p-2">{payment.amount} {payment.currency}</td>
                  <td className="p-2">{payment.method || "manual"}</td>
                  <td className="p-2">{payment.transactionRef || "N/A"}</td>
                  <td className="p-2">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PremiumPendingPage;
