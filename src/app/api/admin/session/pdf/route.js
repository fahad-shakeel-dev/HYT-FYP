import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function POST(request) {
  try {
    const { session } = await request.json();

    if (!session) {
      console.error("Invalid session data received:", session);
      return NextResponse.json({ message: "Invalid session data" }, { status: 400 });
    }

    console.log("Generating PDF for session:", session.sessionType, session.year);

    const pdfReport = await new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: "A4", margin: 50 });
        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => {
          const pdfData = Buffer.concat(buffers).toString("base64");
          console.log("PDF generated successfully, size:", pdfData.length);
          resolve(pdfData);
        });
        doc.on("error", (err) => {
          console.error("PDFDocument error:", err);
          reject(err);
        });

        // Explicitly use Times-Roman to avoid font file issues
        console.log("Setting font to Times-Roman");
        doc.font("Times-Roman").fontSize(20).text("Academic Session Report", { align: "center" });
        doc.moveDown();

        doc.fontSize(14).text("Session Information", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Session Type: ${session.sessionType || "N/A"}`);
        doc.text(`Academic Year: ${session.year || "N/A"}`);
        doc.text(`Start Date: ${session.startDate ? new Date(session.startDate).toLocaleDateString() : "N/A"}`);
        doc.text(`End Date: ${session.endDate ? new Date(session.endDate).toLocaleDateString() : "N/A"}`);
        doc.text(
          `Duration (Days): ${
            session.startDate && session.endDate
              ? Math.ceil((new Date(session.endDate) - new Date(session.startDate)) / (1000 * 60 * 60 * 24))
              : "N/A"
          }`
        );
        doc.moveDown();

        doc.fontSize(14).text("Summary Statistics", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Total Teachers: ${session.sessionData?.teachersProcessed || 0}`);
        doc.text(`Total Students: ${session.sessionData?.studentsProcessed || 0}`);
        doc.text(`Graduated Students: ${session.sessionData?.graduatedStudents || 0}`);
        doc.text(`Continuing Students: ${session.sessionData?.continuingStudents || 0}`);
        doc.text(`Total Classes: ${session.sessionData?.classesProcessed || 0}`);
        doc.text(`Total Sections: ${session.sessionData?.sectionsProcessed || 0}`);
        doc.text(`Subjects Cleared: ${session.sessionData?.subjectsCleared ? "Yes" : "No"}`);
        doc.moveDown();

        if (session.sessionData?.graduates?.length > 0) {
          doc.fontSize(14).text("Graduates", { underline: true });
          doc.moveDown(0.5);

          doc.fontSize(12).text("Name", 50, doc.y, { continued: true });
          doc.text("Reg. Number", 200, doc.y, { continued: true });
          doc.text("Program", 300, doc.y, { continued: true });
          doc.text("Grad. Year", 400, doc.y);
          doc.moveDown(0.5);
          doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();

          session.sessionData.graduates.forEach((g) => {
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
      } catch (err) {
        console.error("Error in PDF generation:", err);
        reject(err);
      }
    });

    return NextResponse.json({ pdfReport });
  } catch (error) {
    console.error("Error generating session PDF:", error);
    return NextResponse.json({ message: "Failed to generate PDF report", error: error.message }, { status: 500 });
  }
}
