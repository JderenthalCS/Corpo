import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";


export default function UploadPage() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleFile(file) {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Please upload a PDF, DOC, DOCX, or TXT file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Please choose a file first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("You must be logged in to upload a document.");
      setUploading(false);
      return;
    }

    const documentId = crypto.randomUUID();
    const filePath = `${user.id}/${documentId}/${selectedFile.name}`;

    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(filePath, selectedFile);

    if (storageError) {
      setMessage(storageError.message);
      setUploading(false);
      return;
    }

    const { data: insertedDocument, error: dbError } = await supabase
      .from("documents")
      .insert({
        id: documentId,
        user_id: user.id,
        file_name: selectedFile.name,
        file_path: filePath,
        file_type: selectedFile.type,
      })
      .select();

    console.log("Inserted document:", insertedDocument);
    console.log("Database error:", dbError);

    if (dbError) {
      setMessage(dbError.message);
      setUploading(false);
      return;
    }

    const { data: insertedReport, error: reportError } = await supabase
  .from("reports")
  .insert({
    user_id: user.id,
    document_id: documentId,
    title: selectedFile.name,
    summary: "Analyzing document...",
    predatory_score: 0,
    risk_level: "Low",
    green_flags: [],
    yellow_flags: ["AI analysis in progress."],
    red_flags: [],
    financial_impact: {
      base_cost: 0,
      fees: 0,
      penalties: 0,
      risk_exposure: 0,
    },
  })
  .select()
  .single();

if (reportError) {
  setMessage(reportError.message);
  setUploading(false);
  return;
}

setMessage("Document uploaded. Analyzing with AI...");

const analyzeResponse = await fetch(
  `http://localhost:8000/analyze/${insertedReport.id}`,
  {
    method: "POST",
  }
);

if (!analyzeResponse.ok) {
  const errorData = await analyzeResponse.json();
  setMessage(
    errorData.detail || "Document uploaded, but AI analysis failed."
  );
  setUploading(false);
  return;
}

setMessage("Document uploaded and analyzed successfully.");
setSelectedFile(null);
setUploading(false);
navigate("/reports");
  }

  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
        Workspace Intake
      </p>
      <h1 className="mb-3 text-4xl font-black">Upload Document</h1>

      <p className="mb-8 max-w-2xl text-sm text-[var(--text-muted)]">
        Upload a lease, contract, agreement, or similar document. Corpo will
        store the file and prepare it for AI analysis.
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition lg:p-20 ${
          isDragging
            ? "border-[var(--accent)] bg-[var(--surface)]"
            : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent-hover)]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(event) => handleFile(event.target.files[0])}
        />

        <div className="mb-4 text-5xl">📄</div>

        <h2 className="mb-2 text-2xl font-bold ">
          Drag and drop your file here
        </h2>

        <p className="text-[var(--text-muted)]">or click to browse</p>

        {selectedFile && (
          <div className="mt-6 rounded-xl bg-[var(--surface-strong)] px-5 py-3 text-[var(--accent)]">
            Selected: {selectedFile.name}
          </div>
        )}
      </div>

      <aside className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-lg font-bold">Before You Upload</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--text-muted)]">
          <li>- PDF, DOC, DOCX, and TXT supported</li>
          <li>- Keep filenames short and clear</li>
          <li>- Analysis begins right after upload</li>
        </ul>
      </aside>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-8 rounded-xl bg-[var(--accent)] px-6 py-3 font-semibold text-[var(--bg)] hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload Document"}
      </button>

      {message && (
        <p className="mt-5 rounded-xl bg-[var(--surface)] p-4 text-[var(--text-muted)]">
          {message}
        </p>
      )}
    </section>
  );
}