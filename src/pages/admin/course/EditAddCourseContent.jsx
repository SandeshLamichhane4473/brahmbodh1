import { useEffect, useState, useCallback } from "react";
import { db } from "../../../firebase/config";
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  query,
  where,
 
 
  
  getCountFromServer
} from "firebase/firestore";
import useCourseHeader from "../../hooks/useCourseHeader";
import RichTextEditor from "../../component/RichTextEditor";
import { generateSlug } from "../../../constant/generateSlug";
import { storage } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate ,useLocation} from "react-router-dom";
 
 
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
/* ─── tiny style injection ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .eacc-wrap *{box-sizing:border-box;}
  .eacc-wrap{
    font-family:'DM Sans',sans-serif;
    background:#f7f6f3;
    min-height:100vh;
    padding:1rem;
  }
  .eacc-card{
    background:#ffffff;
    border:1.5px solid #e4e1da;
    border-radius:16px;
    padding:2rem 2.5rem 2.5rem;
    box-shadow:0 2px 20px rgba(0,0,0,.06);
    width:100%;
  }

  /* ── header ── */
  .eacc-header{
    display:flex;
    align-items:center;
    gap:.75rem;
    margin-bottom:1.75rem;
    padding-bottom:1.25rem;
    border-bottom:1.5px solid #ede9e1;
  }
  .eacc-badge{
    font-family:'DM Mono',monospace;
    font-size:.65rem;
    font-weight:500;
    letter-spacing:.08em;
    text-transform:uppercase;
    padding:.25rem .6rem;
    border-radius:6px;
    background:#1a1a1a;
    color:#f5f0e8;
  }
  .eacc-badge.edit{background:#c8b89a;color:#1a1a1a;}
  .eacc-title{
    font-size:1.25rem;
    font-weight:600;
    color:#1a1a1a;
    letter-spacing:-.02em;
  }

  /* ── section labels ── */
  .eacc-section-label{
    font-family:'DM Mono',monospace;
    font-size:.65rem;
    font-weight:500;
    letter-spacing:.12em;
    text-transform:uppercase;
    color:#a09b90;
    margin:0 0 .75rem;
  }

  /* ── grid rows ── */
  .eacc-row{
    display:grid;
    gap:1rem;
    margin-bottom:1rem;
  }
  .eacc-row-3{grid-template-columns:1fr 1fr 1fr;}
  .eacc-row-2{grid-template-columns:1fr 1fr;}
  .eacc-row-4{grid-template-columns:2fr 2fr 1fr auto;}

  /* ── field wrapper ── */
  .eacc-field{display:flex;flex-direction:column;gap:.35rem;}
  .eacc-label{
    font-size:.78rem;
    font-weight:500;
    color:#5a5650;
    letter-spacing:-.01em;
  }

  /* ── inputs ── */
  .eacc-input,
  .eacc-select{
    width:100%;
    padding:.6rem .85rem;
    border:1.5px solid #ddd8ce;
    border-radius:9px;
    font-family:'DM Sans',sans-serif;
    font-size:.9rem;
    color:#1a1a1a;
    background:#faf9f7;
    outline:none;
    transition:border-color .18s,box-shadow .18s;
    appearance:none;
  }
  .eacc-input:focus,
  .eacc-select:focus{
    border-color:#1a1a1a;
    box-shadow:0 0 0 3px rgba(26,26,26,.07);
    background:#fff;
  }
  .eacc-input::placeholder{color:#c2bdb5;}
  .eacc-select{
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat;
    background-position:right .85rem center;
    padding-right:2.2rem;
  }

  /* ── seq row ── */
  .eacc-seq-wrap{
    display:flex;
    align-items:flex-end;
    gap:.5rem;
  }
  .eacc-seq-wrap .eacc-input{width:120px;}
  .eacc-seq-btn{
    flex-shrink:0;
    height:38px;
    padding:0 1rem;
    border:1.5px solid #ddd8ce;
    border-radius:9px;
    background:#faf9f7;
    font-family:'DM Mono',monospace;
    font-size:.7rem;
    font-weight:500;
    letter-spacing:.06em;
    color:#5a5650;
    cursor:pointer;
    white-space:nowrap;
    transition:all .15s;
    display:flex;
    align-items:center;
    gap:.4rem;
  }
  .eacc-seq-btn:hover:not(:disabled){
    background:#1a1a1a;
    border-color:#1a1a1a;
    color:#f5f0e8;
  }
  .eacc-seq-btn:disabled{opacity:.5;cursor:not-allowed;}
  .eacc-seq-hint{
    font-size:.72rem;
    color:#b0ab9e;
    font-family:'DM Mono',monospace;
    align-self:center;
    padding-bottom:2px;
  }

  /* ── divider ── */
  .eacc-divider{
    height:1px;
    background:#ede9e1;
    margin:1.5rem 0 1.25rem;
  }

  /* ── rich text area ── */
  .eacc-body-label{
    font-size:.78rem;
    font-weight:500;
    color:#5a5650;
    margin-bottom:.5rem;
  }
  .eacc-rte-wrapper{
    border:1.5px solid #ddd8ce;
    border-radius:12px;
    overflow:hidden;
    /* let it grow with content */
    display:flex;
    flex-direction:column;
  }
  /* force the inner editor container to grow */
  .eacc-rte-wrapper > *{
    flex:1;
    min-height:320px;
  }
  /* override any internal scrolling — let height expand */
  .eacc-rte-wrapper .ql-container,
  .eacc-rte-wrapper .ql-editor,
  .eacc-rte-wrapper [contenteditable]{
    overflow:visible !important;
    height:auto !important;
    min-height:280px;
  }
  .eacc-rte-wrapper .ql-toolbar{
    border:none;
    border-bottom:1.5px solid #ede9e1;
    background:#faf9f7;
  }
  .eacc-rte-wrapper .ql-container{border:none;}

  /* ── pill tags for status/visible ── */
  .eacc-pill-group{display:flex;gap:.5rem;flex-wrap:wrap;}
  .eacc-pill{
    padding:.35rem .85rem;
    border-radius:50px;
    border:1.5px solid #ddd8ce;
    font-size:.78rem;
    font-weight:500;
    color:#5a5650;
    cursor:pointer;
    background:#faf9f7;
    transition:all .15s;
    user-select:none;
  }
  .eacc-pill.active{
    background:#1a1a1a;
    border-color:#1a1a1a;
    color:#f5f0e8;
  }

  /* ── action buttons ── */
  .eacc-actions{
    display:flex;
    gap:.75rem;
    justify-content:flex-end;
    margin-top:1.75rem;
    padding-top:1.25rem;
    border-top:1.5px solid #ede9e1;
  }
  .eacc-btn-primary{
    padding:.65rem 1.75rem;
    background:#1a1a1a;
    color:#f5f0e8;
    border:none;
    border-radius:10px;
    font-family:'DM Sans',sans-serif;
    font-size:.9rem;
    font-weight:600;
    cursor:pointer;
    transition:opacity .15s,transform .1s;
    letter-spacing:-.01em;
  }
  .eacc-btn-primary:hover{opacity:.85;transform:translateY(-1px);}
  .eacc-btn-secondary{
    padding:.65rem 1.75rem;
    background:transparent;
    color:#5a5650;
    border:1.5px solid #ddd8ce;
    border-radius:10px;
    font-family:'DM Sans',sans-serif;
    font-size:.9rem;
    font-weight:500;
    cursor:pointer;
    transition:all .15s;
  }
  .eacc-btn-secondary:hover{border-color:#1a1a1a;color:#1a1a1a;}

  /* ── toast ── */
  .eacc-toast{
    position:fixed;
    bottom:1.5rem;
    right:1.5rem;
    background:#1a1a1a;
    color:#f5f0e8;
    padding:.75rem 1.25rem;
    border-radius:10px;
    font-size:.85rem;
    font-weight:500;
    z-index:9999;
    animation:slideUp .25s ease;
    box-shadow:0 4px 20px rgba(0,0,0,.2);
  }
  @keyframes slideUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}

  /* ── responsive ── */
  @media(max-width:680px){
    .eacc-row-3{grid-template-columns:1fr;}
    .eacc-row-2{grid-template-columns:1fr;}
    .eacc-row-4{grid-template-columns:1fr 1fr;}
    .eacc-card{padding:1.25rem;}
  }
`;

/* ── spinner svg ── */
const Spinner = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
    style={{animation:"spin .7s linear infinite"}}
    xmlns="http://www.w3.org/2000/svg">
    <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeDasharray="22" strokeDashoffset="8" strokeLinecap="round"/>
  </svg>
);

/* ════════════════════════════════════════════════ */
export default function EditAddCourseContent() {

  const { state } = useLocation();
  const navigate = useNavigate();

  const editData    = state?.editData    ?? null;
  const isEditMode  = state?.isEditMode  ?? false;
  const selectedCourse = editData?.courseheading ?? "";
 


 
  

  const { courseHeader, loading, error } = useCourseHeader();

  const [text, setText] = useState("");
  const [chosenCourse, setChosenCourse] = useState(selectedCourse || "");
  const [seqLoading, setSeqLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);
   const { user} = useAuth();
 
  const [form, setForm] = useState({
    seqno: "",
    coursesubheading: "",
    coursesubheadingtitle: "",
    body_url: "",
    slug: "",
    log: "",
    status: "C",
    visible: "public",
    
  });


  const initialFormState = {
  seqno: "",
  coursesubheading: "",
  coursesubheadingtitle: "",
  body_url: "",
  slug: "",
  log: "",
  status: "ACTIVE",
  visible: "PRIVATE",
};

 

  /* ── prefill on edit ── */
  useEffect(() => {
    if (editData) {
      setForm({
        seqno: editData.seqno || "",
        coursesubheading: editData.coursesubheading || "",
        coursesubheadingtitle: editData.coursesubheadingtitle || "",
        body_url: editData.body_url || "",
        slug: editData.slug || "",
        log: editData.log || "",
        status: editData.status || "C",
        visible: editData.visible || "public",
      });
      setText(editData.body || "");
      setChosenCourse(editData.courseheading || selectedCourse || "");
    }
  }, [editData, selectedCourse]);

 


useEffect(() => {
  if (editData) {
    setForm({
      seqno: editData.seqno || "",
      coursesubheading: editData.coursesubheading || "",
      coursesubheadingtitle: editData.coursesubheadingtitle || "",
      body_url: editData.body_url || "",
      slug: editData.slug || "",
      log: editData.log || "",
      status: editData.status || "C",
      visible: editData.visible || "PRIVATE",
    });
    setChosenCourse(editData.courseheading || selectedCourse || "");

    // ── load rich text content ──
    if (editData.body_url) {
      // prefer fetching from storage (latest saved HTML with fonts)
      fetch(editData.body_url)
        .then((res) => res.text())
        .then((html) => setText(html))
        .catch(() => {
          // fallback to inline body field if fetch fails
          setText(editData.body || "");
        });
    } else {
      // no url yet, use inline body
      setText(editData.body || "");
    }
  }
}, [editData, selectedCourse]);

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  /* ── auto seq no from Firestore ── */
  const handleAutoSeq = useCallback(async () => {
    if (!chosenCourse) {
      showToast("Please select a course title first");
      return;
    }
    setSeqLoading(true);
    try {
            const countSnap = await getCountFromServer(
              query(collection(db, "coursecontent"), where("courseheading", "==", chosenCourse))
            );

            const nextSeqno = countSnap.data().count + 1;

      const next = nextSeqno  ;
   
      handleChange("seqno", next);
      showToast(`Auto seq → ${next}`);
    } catch (e) {
       showToast("Could not fetch seq no");
      console.error(e.message);
     
    } finally {
      setSeqLoading(false);
    }
  }, [chosenCourse]);

  // function to handle the upload  file to storage
async function uploadfiletostorage(docId) {
  const metadata = {
    contentType: "text/html;charset=UTF-8",
    contentDisposition: "inline",
  };

  const fileName = `${docId}.html`;  // ✅ match the actual content type
  const storageRef = ref(storage, `coursecontent/${fileName}`);

  await uploadString(storageRef, text, "raw", metadata);

  const downloadURL = await getDownloadURL(storageRef);
  if (!downloadURL) { alert("Unable to get download URL"); return; }
  return downloadURL;
}

  // function to handle the upload file to storage end

  /* ── submit ── */
  const handleSubmit = async () => {
  if (
  !chosenCourse?.trim() ||
  !form?.coursesubheading?.trim() ||
  !form?.coursesubheadingtitle?.trim() ||
  form?.seqno === "" ||
  Number(form.seqno) < 0 ||
  !text?.trim()
) {
  alert("All fields are required / some are empty");
  return;
}
     
   const generateTimestampId = () => new Date().valueOf();
   const timestamp = generateTimestampId(); // or Date.now()
  
   


    if (!chosenCourse) { showToast("Select a course first"); return; }
    setSaving(true);
    try {
      if (!isEditMode) {
        const docId = timestamp.toString();
        
        const url= await uploadfiletostorage(docId);


         await setDoc(doc(db, "coursecontent", docId), {
              id: docId,
              courseheading: chosenCourse,
              seqno: Number(form.seqno) || 0,
              coursesubheading: form.coursesubheading,
              coursesubheadingtitle: form.coursesubheadingtitle,
             
              body_url: url,
              slug: generateSlug(form.coursesubheadingtitle.trim()),
              status: "ACTIVE",
              visible: "PRIVATE",
              maker: user.email,
              checker: "",
              log: form.log,
              createdAt: new Date(),
            });

            // ✅ clear form
              setForm(initialFormState);

              // (optional) clear editor text too
              setText("");

              // (optional) clear selected course
              // setChosenCourse("");
      } else {
         // ── re-upload updated HTML content ──
                const url = await uploadfiletostorage(editData.id); // reuse same docId → overwrites old file

                await updateDoc(doc(db, "coursecontent", editData.id), {
                  seqno:                Number(form.seqno) || 0,
                  coursesubheading:     form.coursesubheading,
                  coursesubheadingtitle: form.coursesubheadingtitle,
                  body_url:             url,                    // ✅ fresh URL from re-upload
                  slug:                 generateSlug(form.coursesubheadingtitle.trim()), // ✅ regenerate from title
                  status:               form.status,
                  visible:              form.visible,
                  log:                  form.log,
                  checker:              user.email,             // ✅ checker = who last updated
                  updatedAt:            new Date(),
                });
      }
      
      showToast(isEditMode ? "Updated!" : "Saved!");
      
      
    } catch (e) {
      console.error(e);
      showToast("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  /* ── loading / error states ── */
  if (loading)
    return (
      <div className="eacc-wrap">
        <style>{STYLES}</style>
        <div className="eacc-card" style={{textAlign:"center",padding:"3rem",color:"#a09b90"}}>
          Loading courses…
        </div>
      </div>
    );
  if (error)
    return (
      <div className="eacc-wrap">
        <style>{STYLES}</style>
        <div className="eacc-card" style={{textAlign:"center",padding:"3rem",color:"#c0392b"}}>
          Failed to load courses
        </div>
      </div>
    );

  /* ════ RENDER ════ */
  return (
    <div className="eacc-wrap">
      <style>{STYLES}</style>

      <div className="eacc-card">

        {/* ── Header ── */}
        <div className="eacc-header">
          <span className={`eacc-badge ${isEditMode ? "edit" : ""}`}>
            {isEditMode ? "Edit" : "New"}
          </span>
          <h2 className="eacc-title">
            {isEditMode ? "Edit Course Content" : "Add Course Content"}
          </h2>
          <span onClick={()=>{ navigate("/admin/coursecontent")}} className="eacc-badge">
            back
          </span>
          
        </div>

        {/* ══ ROW 1: Course · Subheading · Subheading Title ══ */}
        <p className="eacc-section-label">Content Identity</p>
        <div className="eacc-row eacc-row-3">

          <div className="eacc-field">
            <label className="eacc-label">Course</label>
            <select
             disabled={editData}
              className="eacc-select"
              value={chosenCourse}
              onChange={(e) => setChosenCourse(e.target.value)}
            >
              <option value="">Select course…</option>
              {courseHeader?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="eacc-field">
            <label className="eacc-label">Sidebar Label</label>
            <input
              className="eacc-input"
              placeholder="e.g. Introduction"
              value={form.coursesubheading}
              onChange={(e) => handleChange("coursesubheading", e.target.value)}
            />
          </div>

          <div className="eacc-field">
            <label className="eacc-label">Main Content Title</label>
            <input
              className="eacc-input"
              placeholder="e.g. Getting Started with…"
              value={form.coursesubheadingtitle}
              onChange={(e) => handleChange("coursesubheadingtitle", e.target.value)}
            />
          </div>

        </div>

        {/* ══ ROW 2: Seq No · Slug · Body URL · Status · Visible ══ */}
        <div className="eacc-row eacc-row-3" style={{marginTop:"1rem"}}>

          {/* Seq No with auto button */}
          <div className="eacc-field">
            <label className="eacc-label">Order (Seq No)</label>
            <div className="eacc-seq-wrap">
              <input
                type="number"
                className="eacc-input"
                placeholder="1, 2, 3…"
                value={form.seqno}
                onChange={(e) => handleChange("seqno", e.target.value)}
              />
              <button
                className="eacc-seq-btn"
                onClick={handleAutoSeq}
                disabled={seqLoading}
                title="Auto-fill next seq no from Firestore"
              >
                {seqLoading ? <Spinner /> : (
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M13.5 2.5A6.5 6.5 0 1 1 8 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    <path d="M13.5 2.5V6H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                Auto
              </button>
            </div>
          </div>

   
 

        </div>

       

        <div className="eacc-divider" />

        {/* ══ RICH TEXT EDITOR — expands with content ══ */}
        <div className="eacc-field">
          <label className="eacc-body-label">Body Content</label>
          <div className="eacc-rte-wrapper">
            <RichTextEditor value={text} onChange={setText} />
          </div>
        </div>

        
        {/* ── Actions ── */}
        <div className="eacc-actions">
          
          <button
            className="eacc-btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving…" : isEditMode ? "Update Content" : "Save Content"}
          </button>
        </div>

      </div>

      {/* ── Toast ── */}
      {toast && <div className="eacc-toast">{toast}</div>}
    </div>
  );
}
