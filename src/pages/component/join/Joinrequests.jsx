import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function JoinRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const snap = await getDocs(
          query(collection(db, "join_requests"), orderBy("createdAt", "desc"))
        );
        const data = snap.docs.map((doc, index) => ({
          id: doc.id,
          sn: index + 1,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString("ne-NP", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }) || "—",
        }));
        setRequests(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) =>
    [r.phone_number, r.email, r.facebook_url, r.remarks]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        लोड हुँदैछ...
      </div>
    );

  return (
    <div
      className="p-6"
      style={{ fontFamily: "'Noto Sans Devanagari', Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">सामेल हुने अनुरोधहरू</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            कुल {requests.length} अनुरोध प्राप्त भएका छन्
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="खोज्नुहोस्..."
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 w-full sm:w-64"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          कुनै अनुरोध फेला परेन।
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">क्र.सं.</th>
                <th className="px-4 py-3 font-semibold">फोन नम्बर</th>
                <th className="px-4 py-3 font-semibold">इमेल</th>
                <th className="px-4 py-3 font-semibold">फेसबुक</th>
                <th className="px-4 py-3 font-semibold">कैफियत</th>
                <th className="px-4 py-3 font-semibold">मिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="bg-white hover:bg-gray-50 transition-colors duration-100"
                >
                  <td className="px-4 py-3 text-gray-400 font-mono">{r.sn}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                    {r.phone_number || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {r.email ? (
                      <a
                        href={`mailto:${r.email}`}
                        className="text-primary hover:underline"
                      >
                        {r.email}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {r.facebook_url ? (
                      <a
                        href={r.facebook_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline truncate block max-w-[160px]"
                      >
                        {r.facebook_url.replace("https://facebook.com/", "@")}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                    <span className="line-clamp-2">{r.remarks || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                    {r.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}