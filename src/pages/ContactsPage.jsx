import { useEffect, useState } from "react";
import api from "../api";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/admin/contact-messages");
        setContacts(data.messages || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading contact messages...</p>;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-bold text-slate-900">Contacts</h2>
      <p className="mt-1 text-sm text-slate-600">Total: {contacts.length}</p>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Message</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((item) => (
              <tr key={item._id} className="border-t border-slate-200">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.email}</td>
                <td className="p-2">{item.subject || "N/A"}</td>
                <td className="p-2 max-w-sm truncate" title={item.message}>{item.message}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ContactsPage;
