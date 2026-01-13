import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function POST(request) {
  try {
    const { graduates } = await request.json();

    if (!graduates || !Array.isArray(graduates)) {
      return NextResponse.json({ message: "Invalid graduates data" }, { status: 400 });
    }

    const pdfReport = await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers).toString("base64");
        resolve(pdfData);
      });
      doc.on("error", reject);

      // Explicitly use Times-Roman to avoid font file issues
      doc.font("Times-Roman").fontSize(20).text("Graduates Report", { align: "center" });
      doc.moveDown();

      if (graduates.length > 0) {
        doc.fontSize(14).text("Graduates", { underline: true });
        doc.moveDown(0.5);

        doc.fontSize(12).text("Name", 50, doc.y, { continued: true });
        doc.text("Reg. Number", 200, doc.y, { continued: true });
        doc.text("Program", 300, doc.y, { continued: true });
        doc.text("Grad. Year", 400, doc.y);
        doc.moveDown(0.5);
        doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        graduates.forEach((g) => {
          doc.text(g.name || "N/A", 50, doc.y, { continued: true });
          doc.text(g.registrationNumber || "N/A", 200, doc.y, { continued: true });
          doc.text(g.program || "N/A", 300, doc.y, { continued: true });
          doc.text(g.graduationYear?.toString() || "N/A", 400, doc.y);
          doc.moveDown(0.5);
        });
      } else {
        doc.fontSize(12).text("No graduates found", { align: "center" });
      }

      doc.end();
    });

    return NextResponse.json({ pdfReport });
  } catch (error) {
    console.error("Error generating graduates PDF:", error);
    return NextResponse.json({ message: "Failed to generate PDF report", error: error.message }, { status: 500 });
  }
}
