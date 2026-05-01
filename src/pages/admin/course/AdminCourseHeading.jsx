import { useState } from "react";
import { collection,  setDoc,getDocs, updateDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
 
import { db } from "../../../firebase/config";
import { iconOptions } from "../../../constant/courseIcons";
 

const colorPresets = [
  { bg: "#EEEDFE", stroke: "#534AB7", label: "Purple" },
  { bg: "#E1F5EE", stroke: "#0F6E56", label: "Teal" },
  { bg: "#FAEEDA", stroke: "#854F0B", label: "Amber" },
  { bg: "#FBEAF0", stroke: "#993556", label: "Pink" },
  { bg: "#FAECE7", stroke: "#993C1D", label: "Coral" },
  { bg: "#E6F1FB", stroke: "#185FA5", label: "Blue" },
  { bg: "#EAF3DE", stroke: "#3B6D11", label: "Green" },
  { bg: "#FCEBEB", stroke: "#A32D2D", label: "Red" },
];

const initialForm = {
  id: "",
  name: "",
  sub: "",
  path: "",
  bg: "#EEEDFE",
  stroke: "#534AB7",
  iconKey: "book",
  order: "",
};

export default function AdminCourseHeading() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
const [editId, setEditId] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
    setError("");
  };

  // Auto-generate id and path from name
  const handleNameChange = (value) => {
    const slug = value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    setForm((prev) => ({
      ...prev,
      name: value,
      id: slug,
      path: `/courses/${slug}`,
    }));
    setSuccess(false);
    setError("");
  };

  const handleColorPreset = (preset) => {
    setForm((prev) => ({ ...prev, bg: preset.bg, stroke: preset.stroke }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Course name is required.";
    if (!form.sub.trim()) return "Subtitle is required.";
    if (!form.id.trim()) return "ID is required.";
    if (!form.order.toString().trim()) return "Order is required.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
            try {
            if (editId) {
               await updateDoc(doc(db, "courseheader", editId), {
              ...form,
              order: Number(form.order),
                 
            } ) 
           return;      
          };
            await setDoc(doc(db, "courseheader", form.id), {
                id: form.id,
                name: form.name.trim(),
                sub: form.sub.trim(),
                path: form.path.trim(),
                bg: form.bg,
                stroke: form.stroke,
                iconKey: form.iconKey,
                order: Number(form.order),
                createdAt: new Date(),
            });
            setSuccess(true);
            setForm(initialForm);
            } catch (e) {
            setError("Failed to save. Please try again.");
            console.error(e.message);
            } finally {
            setLoading(false);
            }
  };

  const selectedIcon = iconOptions.find((i) => i.key === form.iconKey);


  const fetchCourses = async () => {
  try {
    const snap = await getDocs(collection(db, "courseheader"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCourses(data.sort((a, b) => a.order - b.order));
  } catch (e) {
    console.error(e);
  }
};

//Edit Function
const handleEdit = (course) => {
  setForm(course);
  setEditId(course.id);
};

useEffect(() => {
  fetchCourses();
}, []);

  return (
    <div className="    px-4 py-2\0" style={{ fontFamily: "Arial, sans-serif" }}>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Add Course Category</h1>
        <p className="text-sm text-neutral-400 mt-1">Fill in the details below to add a new course to Firestore.</p>
      </div>

      <div className="flex flex-row gap-5">
      <div>
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
            Course Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. आत्मबोध"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-base text-neutral-900 outline-none focus:border-neutral-900 transition"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
            Subtitle (English) <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Self-knowledge"
            value={form.sub}
            onChange={(e) => handleChange("sub", e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-base text-neutral-900 outline-none focus:border-neutral-900 transition"
          />
        </div>

        {/* ID + Path — auto generated, editable */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
              ID
            </label>
            <input
              type="text"
              placeholder="atmabodh"
              value={form.id}
              onChange={(e) => handleChange("id", e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-900 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
              Path
            </label>
            <input
              type="text"
              placeholder="/courses/atmabodh"
              value={form.path}
              onChange={(e) => handleChange("path", e.target.value)}
              className="w-full border border-neutral-200 rounded-lg px-4 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-900 transition"
            />
          </div>
        </div>

        {/* Order */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1.5">
            Display Order <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            placeholder="1"
            value={form.order}
            onChange={(e) => handleChange("order", e.target.value)}
            className="w-32 border border-neutral-200 rounded-lg px-4 py-2 text-base text-neutral-900 outline-none focus:border-neutral-900 transition"
          />
        </div>

        {/* Icon picker */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
            Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {iconOptions.map((icon) => (
              <button
                key={icon.key}
                type="button"
                onClick={() => handleChange("iconKey", icon.key)}
                title={icon.label}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all
                  ${form.iconKey === icon.key
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                  }`}
              >
                {icon.preview}
              </button>
            ))}
          </div>
        </div>

        {/* Color presets */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleColorPreset(preset)}
                title={preset.label}
                className={`w-11 h-11 rounded-xl border-2 transition-all flex items-center justify-center
                  ${form.bg === preset.bg ? "border-neutral-900 scale-110" : "border-transparent"}`}
                style={{ backgroundColor: preset.bg }}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.stroke }} />
              </button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-2">
            Preview
          </label>
          <div className="inline-flex flex-col items-center gap-3 bg-white border border-neutral-200 rounded-2xl px-6 py-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: form.bg, color: form.stroke }}
            >
              {selectedIcon?.preview}
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-neutral-900">
                {form.name || "Course Name"}
              </p>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wide mt-0.5">
                {form.sub || "Subtitle"}
              </p>
            </div>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            Course added successfully!
          </p>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-neutral-900 text-white font-semibold text-sm uppercase tracking-widest py-3 rounded-xl hover:bg-neutral-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : editId ? "Update" : "Add Course →"}
        </button>

      </div>
    


{/* ################## DISPLAY THE COURSE HEADER */}
      <div className="mt-12">
  <h2 className="text-lg font-semibold mb-4">Manage Courses</h2>

  <div className="overflow-x-auto border rounded-xl">
    <table className="w-full text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-3">Name</th>
          <th className="p-3">Subtitle</th>
          <th className="p-3">Order</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {courses.map((c) => (
          <tr key={c.id} className="border-t">
            <td className="p-3">{c.name}</td>
            <td className="p-3">{c.sub}</td>
            <td className="p-3">{c.order}</td>

            <td className="p-3">
              <button
                onClick={() => handleEdit(c)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

 </div>
    </div>
  );
}