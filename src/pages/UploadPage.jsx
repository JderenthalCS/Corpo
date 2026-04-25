import { useRef, useState } from "react";

export default function UploadPage() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file) {
    if (!file) return;
    setSelectedFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  function handleAnalyze() {
    if (!selectedFile) return alert("Please upload a file first.");

    // Later: send selectedFile to FastAPI/Node backend.
    alert(`Ready to analyze: ${selectedFile.name}`);
  }

  return (
    <section>
      <h1 className="mb-3 text-4xl font-bold">Upload Document</h1>
      <p className="mb-8 max-w-2xl text-slate-300">
        Upload a lease, contract, agreement, or similar document. Corpo will
        analyze it and generate a plain-English risk report.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
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
          onChange={(e) => handleFile(e.target.files[0])}
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
        onClick={handleAnalyze}
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
      >
        Analyze Document
      </button>
    </section>
  );
}