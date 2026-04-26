import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UploadPage() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

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
  }

  return (
    <section>
      <h1 className="mb-3 text-4xl font-bold">Upload Document</h1>

      <p className="mb-8 max-w-2xl text-slate-300">
        Upload a lease, contract, agreement, or similar document. Corpo will
        store the file and prepare it for AI analysis.
      </p>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-16 text-center transition ${
          isDragging
            ? "border-blue-400 bg-blue-950/40"
            : "border-slate-700 bg-slate-900 hover:border-blue-500"
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

        <h2 className="mb-2 text-2xl font-bold">
          Drag and drop your file here
        </h2>

        <p className="text-slate-400">or click to browse</p>

        {selectedFile && (
          <div className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-blue-300">
            Selected: {selectedFile.name}
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Upload Document"}
      </button>

      {message && (
        <p className="mt-5 rounded-xl bg-slate-900 p-4 text-slate-300">
          {message}
        </p>
      )}
    </section>
  );
}