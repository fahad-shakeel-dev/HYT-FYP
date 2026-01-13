import { NextResponse } from "next/server";
import ExcelJS from "exceljs";

export async function POST(request) {
  try {
    const { graduates } = await request.json();

    if (!graduates || !Array.isArray(graduates)) {
      console.error("Invalid graduates data received:", graduates);
      return NextResponse.json({ message: "Invalid graduates data" }, { status: 400 });
    }

    console.log("Generating Excel for graduates, count:", graduates.length);

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Graduates Report");

    // Define columns
    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Registration Number", key: "registrationNumber", width: 20 },
      { header: "Program", key: "program", width: 20 },
      { header: "Graduation Year", key: "graduationYear", width: 15 },
    ];

    // Add graduates data
    if (graduates.length > 0) {
      graduates.forEach((g) => {
        worksheet.addRow({
          name: g.name || "N/A",
          registrationNumber: g.registrationNumber || "N/A",
          program: g.program || "N/A",
          graduationYear: g.graduationYear?.toString() || "N/A",
        });
      });
    } else {
      worksheet.addRow({ name: "No graduates found" });
    }

    // Style the worksheet
    worksheet.getRow(1).font = { bold: true, size: 14 };
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
    console.error("Error generating graduates Excel:", error);
    return NextResponse.json({ message: "Failed to generate Excel report", error: error.message }, { status: 500 });
  }
}
