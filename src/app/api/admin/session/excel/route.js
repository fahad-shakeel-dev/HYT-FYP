import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(request) {
  try {
    const { session } = await request.json();

    if (!session) {
      console.error("Invalid session data received:", session);
      return NextResponse.json({ message: "Invalid session data" }, { status: 400 });
    }

    console.log("Generating Excel for session:", session.sessionType, session.year);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Session Report");

    // Define columns
    worksheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Value", key: "value", width: 50 },
    ];

    // Add session information
    worksheet.addRow({ field: "Session Type", value: session.sessionType || "N/A" });
    worksheet.addRow({ field: "Academic Year", value: session.year || "N/A" });
    worksheet.addRow({
      field: "Start Date",
      value: session.startDate ? new Date(session.startDate).toLocaleDateString() : "N/A",
    });
    worksheet.addRow({
      field: "End Date",
      value: session.endDate ? new Date(session.endDate).toLocaleDateString() : "N/A",
    });
    worksheet.addRow({
      field: "Duration (Days)",
      value:
        session.startDate && session.endDate
          ? Math.ceil((new Date(session.endDate) - new Date(session.startDate)) / (1000 * 60 * 60 * 24))
          : "N/A",
    });

    // Add summary statistics
    worksheet.addRow({});
    worksheet.addRow({ field: "Summary Statistics", value: "" });
    worksheet.addRow({ field: "Total Teachers", value: session.sessionData?.teachersProcessed || 0 });
    worksheet.addRow({ field: "Total Students", value: session.sessionData?.studentsProcessed || 0 });
    worksheet.addRow({ field: "Graduated Students", value: session.sessionData?.graduatedStudents || 0 });
    worksheet.addRow({ field: "Continuing Students", value: session.sessionData?.continuingStudents || 0 });
    worksheet.addRow({ field: "Total Classes", value: session.sessionData?.classesProcessed || 0 });
    worksheet.addRow({ field: "Total Sections", value: session.sessionData?.sectionsProcessed || 0 });
    worksheet.addRow({ field: "Subjects Cleared", value: session.sessionData?.subjectsCleared ? "Yes" : "No" });

    // Add graduates table if available
    if (session.sessionData?.graduates?.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({ field: "Graduates", value: "" });
      worksheet.addRow({
        field: "Name",
        value: "Registration Number | Program | Graduation Year",
      });

      session.sessionData.graduates.forEach((g) => {
        worksheet.addRow({
          field: g.name || "N/A",
          value: `${g.registrationNumber || "N/A"} | ${g.program || "N/A"} | ${g.graduationYear?.toString() || "N/A"}`,
        });
      });
    } else {
      worksheet.addRow({});
      worksheet.addRow({ field: "No graduates found", value: "" });
    }

    // Style the worksheet
    worksheet.getRow(1).font = { bold: true, size: 14 };
    worksheet.getRow(7).font = { bold: true };
    worksheet.getRow(13).font = { bold: true };
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const excelData = buffer.toString("base64");

    console.log("Excel file generated successfully, size:", excelData.length);

    return NextResponse.json({ excelReport: excelData });
  } catch (error) {
    console.error("Error generating Excel report:", error);
    return NextResponse.json({ message: "Failed to generate Excel report", error: error.message }, { status: 500 });
  }
}
