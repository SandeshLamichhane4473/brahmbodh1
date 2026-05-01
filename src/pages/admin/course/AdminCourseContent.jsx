import { useEffect, useState, useMemo } from "react";
import { db } from "../../../firebase/config";
import { useNavigate } from "react-router-dom";
 
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";

const PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function AdminCourseContent() {
  const [courses, setCourses]           = useState([]);
  const [contents, setContents]         = useState([]);
  const [loading, setLoading]           = useState(false);

  // filters
  const [selectedCourse, setSelectedCourse] = useState("");
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [visibleFilter, setVisibleFilter] = useState("");

  // sort
  const [sortField, setSortField]       = useState(null);
  const [sortDir, setSortDir]           = useState(1); // 1 asc, -1 desc

  // pagination
  const [currentPage, setCurrentPage]   = useState(1);
  const [perPage, setPerPage]           = useState(10);
  const [modalUrl, setModalUrl] = useState(null);

  const navigate = useNavigate();

  // ── fetch courses ──────────────────────────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      const snap = await getDocs(collection(db, "courseheader"));
      setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchCourses();
  }, []);

  // ── fetch contents (all, or filtered by course) ────────────────
  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const ref = collection(db, "coursecontent");
        const q = selectedCourse
          ? query(ref, where("courseheading", "==", selectedCourse))
          : ref;
        const snap = await getDocs(q);
        setContents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, [selectedCourse]);

  // ── derived: filter + sort ─────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let rows = contents.filter((d) => {
      const matchSearch =
        !q ||
        (d.coursesubheading || "").toLowerCase().includes(q) ||
        (d.coursesubheadingtitle || "").toLowerCase().includes(q) ||
        (d.slug || "").toLowerCase().includes(q) ||
        (d.courseheading || "").toLowerCase().includes(q);
      const matchStatus  = !statusFilter  || d.status  === statusFilter;
      const matchVisible = !visibleFilter || (d.visible || "").toUpperCase() === visibleFilter;
      return matchSearch && matchStatus && matchVisible;
    });

    if (sortField) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortField], bv = b[sortField];
        if (typeof av === "number") return (av - bv) * sortDir;
        return String(av ?? "").localeCompare(String(bv ?? "")) * sortDir;
      });
    }
    return rows;
  }, [contents, search, statusFilter, visibleFilter, sortField, sortDir]);

  // ── pagination ─────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage    = Math.min(currentPage, totalPages);
  const pageStart   = (safePage - 1) * perPage;
  const pageData    = filtered.slice(pageStart, pageStart + perPage);

  const goPage = (p) => setCurrentPage(Math.max(1, Math.min(p, totalPages)));

  // reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [search, selectedCourse, statusFilter, visibleFilter, perPage]);

  // ── sort toggle ────────────────────────────────────────────────
  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d * -1);
    else { setSortField(field); setSortDir(1); }
  };

  const sortIcon = (field) => {
    if (sortField !== field) return <span className="text-gray-300 ml-1 text-xs">↕</span>;
    return <span className="text-blue-500 ml-1 text-xs">{sortDir === 1 ? "↑" : "↓"}</span>;
  };

  // ── edit ───────────────────────────────────────────────────────
  const handleEdit = (row) => {
    navigate("/admin/editcoursecontent", {
      state: { editData: row, isEditMode: true },
    });
  };

  // ── page number buttons ────────────────────────────────────────
  const pageNumbers = () => {
    let start = Math.max(1, safePage - 2);
    let end   = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // ── badge helpers ──────────────────────────────────────────────
  const statusBadge = (s) => {
    const map = {
      ACTIVE:   "bg-green-50 text-green-700",
      DRAFT:    "bg-amber-50 text-amber-700",
      INACTIVE: "bg-gray-100 text-gray-500",
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[s] || map.INACTIVE}`}>
        {s}
      </span>
    );
  };

  // const visibleBadge = (v) => {
  //   const upper = (v || "").toUpperCase();
  //   const cls = upper === "PUBLIC"
  //     ? "bg-blue-50 text-blue-600"
  //     : "bg-purple-50 text-purple-600";
  //   return (
  //     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
  //       {upper}
  //     </span>
  //   );
  // };


  //---- toggle function ____________________________________
  const handleToggleVisible = async (row) => {
  const newVisible = row.visible.toUpperCase() === "PUBLIC" ? "PRIVATE" : "PUBLIC";
  
  // optimistic update — instant UI response
  setContents((prev) =>
    prev.map((c) => c.id === row.id ? { ...c, visible: newVisible } : c)
  );

  try {
    await updateDoc(doc(db, "coursecontent", row.id), { visible: newVisible });
  } catch (e) {
    console.error(e);
    // revert on failure
    setContents((prev) =>
      prev.map((c) => c.id === row.id ? { ...c, visible: row.visible } : c)
    );
  }
};
  // ── render ─────────────────────────────────────────────────────
  return (
    <div className="w-full p-6 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          Course Content
          <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </h1>
        <button
          onClick={() => navigate("/admin/editcoursecontent")}
          className="flex items-center gap-1.5 bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Content
        </button>
      </div>

      {/* Filter / Search bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search title, subheading, slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Course filter */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name || c.id}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        {/* Visibility filter */}
        <select
          value={visibleFilter}
          onChange={(e) => setVisibleFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
        >
          <option value="">All Visibility</option>
          <option value="PUBLIC">Public</option>
          <option value="PRIVATE">Private</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <Th onClick={() => toggleSort("courseheading")} label="Course"    icon={sortIcon("courseheading")} />
              <Th onClick={() => toggleSort("coursesubheading")} label="Subheading" icon={sortIcon("coursesubheading")} />
              <Th onClick={() => toggleSort("coursesubheadingtitle")} label="Title" icon={sortIcon("coursesubheadingtitle")} />
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Slug</th>
              <Th onClick={() => toggleSort("seqno")} label="Seq" icon={sortIcon("seqno")} />
              <Th onClick={() => toggleSort("status")} label="Status" icon={sortIcon("status")} />
              <Th onClick={() => toggleSort("visible")} label="Visible" icon={sortIcon("visible")} />
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">File</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">Loading…</td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No records found</td>
              </tr>
            ) : (
              pageData.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {row.courseheading}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.coursesubheading}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-[180px] truncate" title={row.coursesubheadingtitle}>
                    {row.coursesubheadingtitle}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-[160px] truncate" title={row.slug}>
                    {row.slug}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-gray-500">{row.seqno}</td>
                  <td className="px-4 py-3">{statusBadge(row.status)}</td>
                  
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleVisible(row)}
                      title={`Click to set ${row.visible.toUpperCase() === "PUBLIC" ? "Private" : "Public"}`}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-80 active:scale-95
                        ${row.visible.toUpperCase() === "PUBLIC"
                          ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                          : "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                        }`}
                    >
                      {row.visible.toUpperCase() === "PUBLIC" ? (
                        <>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                          PUBLIC
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          PRIVATE
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {row.body_url ? (
                     // After
                  <button
                    onClick={() => setModalUrl(row.body_url)}
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs font-medium"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    View
                  </button>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(row)}
                      className="inline-flex items-center gap-1.5 border border-gray-200 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 flex-wrap gap-2">
          {/* Per page */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            Rows per page:
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-2 py-1 text-xs bg-white focus:outline-none focus:border-blue-400"
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Info */}
          <span className="text-xs text-gray-400">
            {filtered.length === 0
              ? "0–0 of 0"
              : `${pageStart + 1}–${Math.min(pageStart + perPage, filtered.length)} of ${filtered.length}`}
          </span>

          {/* Page buttons */}
          <div className="flex gap-1">
            <PageBtn onClick={() => goPage(safePage - 1)} disabled={safePage === 1}>←</PageBtn>
            {pageNumbers().map((n) => (
              <PageBtn key={n} active={n === safePage} onClick={() => goPage(n)}>{n}</PageBtn>
            ))}
            <PageBtn onClick={() => goPage(safePage + 1)} disabled={safePage === totalPages}>→</PageBtn>
          </div>
        </div>
      </div>




      {modalUrl && (
  <div
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={() => setModalUrl(null)} // click backdrop to close
  >
    <div
      className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl"
      onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
    >
      {/* Modal header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Content Preview</span>
        <button
          onClick={() => setModalUrl(null)}
          className="text-gray-400 hover:text-gray-700 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* iframe renders the .html file inline */}
      <iframe
        src={modalUrl}
        className="flex-1 w-full"
        title="Content Preview"
      />
    </div>
  </div>
)}
    </div>
  );
}

// ── small helpers ─────────────────────────────────────────────────

function Th({ onClick, label, icon }) {
  return (
    <th
      onClick={onClick}
      className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 cursor-pointer hover:text-gray-700 select-none whitespace-nowrap"
    >
      {label}{icon}
    </th>
  );
}

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[28px] px-2 py-1 text-xs rounded-md border transition
        ${active
          ? "bg-black text-white border-black"
          : "bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"}
        disabled:opacity-30 disabled:cursor-default`}
    >
      {children}
    </button>
  );
}
