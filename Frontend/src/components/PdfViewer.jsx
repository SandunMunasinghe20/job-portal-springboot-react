export default function PdfViewer({ base64Pdf }) {
  if (!base64Pdf) return <div>No resume available</div>;

  // Construct the data URI for the PDF
  const pdfData = `data:application/pdf;base64,${base64Pdf}`;

  return (
    <iframe
      src={pdfData}
      width="600"
      height="800"
      title="Resume PDF"
      style={{ border: "none" }}
    />
  );
}
