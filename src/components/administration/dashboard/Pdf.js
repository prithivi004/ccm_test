import React from "react";
import ReactDOM from "react-dom";
import html2canvas from "html2canvas";
import jsPdf from "jspdf";


function Pdf() {
  const printPDF = () => {
    const domElement = document.getElementById("root");
    html2canvas(domElement, {
      onclone: document => {
        document.getElementById("print").style.visibility = "hidden";
      }
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPdf();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save(`${new Date().toISOString()}.pdf`);
    });
  };

  return (
    <div className="App">
      <button id="print" onClick={printPDF}>
        PRINT
      </button>
    </div>
  );
}
export default Pdf
const rootElement = document.getElementById("root");
ReactDOM.render(<Pdf />, rootElement);
