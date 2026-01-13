import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Session from "@/models/Session";
import User from "@/models/User";
import Student from "@/models/Student";
import Graduate from "@/models/Graduate";
import ClassSection from "@/models/ClassSection";
import Class from "@/models/ClassSchema";
import RegistrationRequest from "@/models/RegistrationRequest";
import mongoose from "mongoose";
import ExcelJS from "exceljs";

// Helper function to calculate student statistics
const calculateStudentStatistics = (students, sessionStatistics) => {
  const currentYear = new Date().getFullYear();
  let graduatedStudents = [];
  let continuingStudents = [];

  students.forEach((student) => {
    const semester = parseInt(student.semester) || 1;
    const program = student.program || "Unknown";
    const section = student.section || "Unknown";
    const enrollmentYear = student.enrollmentYear || new Date(student.createdAt).getFullYear();

    if (semester >= 8) {
      graduatedStudents.push({
        ...student,
        graduationYear: currentYear,
        graduationDate: new Date(),
        totalSemesters: 8,
        degreeStatus: "Completed",
      });
      sessionStatistics.graduationStats.totalGraduated++;
      sessionStatistics.graduationStats.graduatedByProgram[program] =
        (sessionStatistics.graduationStats.graduatedByProgram[program] || 0) + 1;
    } else {
      continuingStudents.push({
        ...student,
        newSemester: semester + 1,
      });
    }

    sessionStatistics.studentsBySemester[semester] = (sessionStatistics.studentsBySemester[semester] || 0) + 1;
    sessionStatistics.studentsByProgram[program] = (sessionStatistics.studentsByProgram[program] || 0) + 1;
    sessionStatistics.studentsBySection[section] = (sessionStatistics.studentsBySection[section] || 0) + 1;
    sessionStatistics.studentsByEnrollmentYear[enrollmentYear] =
      (sessionStatistics.studentsByEnrollmentYear[enrollmentYear] || 0) + 1;

    const expectedGraduation = enrollmentYear + 4;
    const isGraduated = semester >= 8 || currentYear >= expectedGraduation;

    sessionStatistics.degreeCompletionTracking.push({
      name: student.name,
      registrationNumber: student.registrationNumber,
      program,
      enrollmentYear,
      expectedGraduation,
      currentSemester: semester,
      isGraduated,
      yearsCompleted: currentYear - enrollmentYear,
      status: semester >= 8 ? "Graduated" : "Continuing",
    });
  });

  return { graduatedStudents, continuingStudents };
};

// Helper function to calculate class statistics
const calculateClassStatistics = (classes, sessionStatistics) => {
  classes.forEach((cls) => {
    const semester = cls.semester || "Unknown";
    const program = cls.program || "Unknown";
    sessionStatistics.classesBySemester[semester] = (sessionStatistics.classesBySemester[semester] || 0) + 1;
    sessionStatistics.classesByProgram[program] = (sessionStatistics.classesByProgram[program] || 0) + 1;
  });
};

// Helper function to calculate teacher assignment details
const calculateTeacherAssignments = (teachers, sessionStatistics) => {
  teachers.forEach((teacher) => {
    if (teacher.classAssignments?.length > 0) {
      teacher.classAssignments.forEach((assignment) => {
        sessionStatistics.teacherAssignments.push({
          teacherName: teacher.name,
          teacherEmail: teacher.email,
          className: assignment.classDisplayName || assignment.className,
          subject: assignment.subject,
          sections: assignment.sections ? assignment.sections.join(", ") : "N/A",
          assignedAt: assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString() : "N/A",
        });
      });
    }
  });
};

// Helper function to generate Excel report
const generateExcelReport = async (sessionData, graduatedStudents) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Session Report");

    // Define columns
    worksheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Value", key: "value", width: 50 },
    ];

    // Add session information
    worksheet.addRow({ field: "Session Type", value: sessionData.sessionType || "N/A" });
    worksheet.addRow({ field: "Academic Year", value: sessionData.year || "N/A" });
    worksheet.addRow({
      field: "Start Date",
      value: sessionData.startDate ? new Date(sessionData.startDate).toLocaleDateString() : "N/A",
    });
    worksheet.addRow({
      field: "End Date",
      value: sessionData.endDate ? new Date(sessionData.endDate).toLocaleDateString() : "N/A",
    });
    worksheet.addRow({
      field: "Duration (Days)",
      value:
        sessionData.startDate && sessionData.endDate
          ? Math.ceil((new Date(sessionData.endDate) - new Date(sessionData.startDate)) / (1000 * 60 * 60 * 24))
          : "N/A",
    });

    // Add summary statistics
    worksheet.addRow({});
    worksheet.addRow({ field: "Summary Statistics", value: "" });
    worksheet.addRow({ field: "Total Teachers", value: sessionData.teachersProcessed || 0 });
    worksheet.addRow({ field: "Total Students", value: sessionData.studentsProcessed || 0 });
    worksheet.addRow({ field: "Graduated Students", value: sessionData.graduatedStudents || 0 });
    worksheet.addRow({ field: "Continuing Students", value: sessionData.continuingStudents || 0 });
    worksheet.addRow({ field: "Total Classes", value: sessionData.classesProcessed || 0 });
    worksheet.addRow({ field: "Total Sections", value: sessionData.sectionsProcessed || 0 });
    worksheet.addRow({ field: "Subjects Cleared", value: sessionData.subjectsCleared ? "Yes" : "No" });

    // Add graduates table if available
    if (graduatedStudents.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({ field: "Graduates", value: "" });
      worksheet.addRow({
        field: "Name",
        value: "Registration Number | Program | Graduation Year",
      });

      graduatedStudents.forEach((g) => {
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

    console.log("Excel report generated successfully, size:", excelData.length);
    return excelData;
  } catch (error) {
    console.error("Error generating Excel report:", error);
    throw error;
  }
};

export async function POST(request) {
  try {
    await connectDB();

    const activeSession = await Session.findOne({ isActive: true });
    if (!activeSession) {
      return NextResponse.json({ message: "No active session found" }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      console.log("🔄 Starting session end process...");

      const [teachers, students, classes, classSections, registrationRequests] = await Promise.all([
        User.find({ role: "teacher" }).lean(),
        Student.find({}).lean(),
        Class.find({}).lean(),
        ClassSection.find({}).lean(),
        RegistrationRequest.find({}).lean(),
      ]);

      console.log("📊 Data collected:", {
        teachers: teachers.length,
        students: students.length,
        classes: classes.length,
        sections: classSections.length,
        requests: registrationRequests.length,
      });

      const sessionStatistics = {
        totalTeachers: teachers.length,
        totalStudents: students.length,
        totalClasses: classes.length,
        totalSections: classSections.length,
        totalRequests: registrationRequests.length,
        approvedTeachers: teachers.filter((t) => t.isApproved).length,
        teachersWithAssignments: teachers.filter((t) => t.classAssignments?.length > 0).length,
        studentsBySemester: {},
        studentsByProgram: {},
        studentsBySection: {},
        studentsByEnrollmentYear: {},
        classesBySemester: {},
        classesByProgram: {},
        sectionsWithTeachers: classSections.filter((s) => s.assignedTeacher).length,
        sectionsWithStudents: classSections.filter((s) => s.enrolledStudents > 0).length,
        teacherAssignments: [],
        degreeCompletionTracking: [],
        graduationStats: {
          totalGraduated: 0,
          graduatedByProgram: {},
        },
      };

      const { graduatedStudents, continuingStudents } = calculateStudentStatistics(students, sessionStatistics);
      calculateClassStatistics(classes, sessionStatistics);
      calculateTeacherAssignments(teachers, sessionStatistics);

      console.log(`🎓 Processing ${graduatedStudents.length} graduating students and ${continuingStudents.length} continuing students`);

      console.log("👨‍🏫 Clearing teacher assignments...");
      await User.updateMany({ role: "teacher" }, { $set: { classAssignments: [] } }, { session });

      if (graduatedStudents.length > 0) {
        console.log(`🎓 Moving ${graduatedStudents.length} students to graduates...`);
        const graduateRecords = graduatedStudents.map((student) => ({
          name: student.name || "Unknown",
          email: student.email || "N/A",
          registrationNumber: student.registrationNumber || `TEMP-${Date.now()}`,
          program: student.program || "Unknown",
          section: student.section || "Unknown",
          originalStudentId: student._id,
          enrollmentYear: student.enrollmentYear || new Date(student.createdAt).getFullYear(),
          graduationYear: new Date().getFullYear(),
          graduationDate: new Date(),
          totalSemesters: 8,
          degreeStatus: "Completed",
          createdAt: new Date(),
          graduatedInSession: {
            sessionType: activeSession.sessionType,
            year: activeSession.year,
            sessionId: activeSession._id,
          },
        }));

        await Graduate.insertMany(graduateRecords, { session });
        const graduatedIds = graduatedStudents.map((s) => s._id);
        await Student.deleteMany({ _id: { $in: graduatedIds } }, { session });
        console.log(`✅ ${graduatedStudents.length} students graduated successfully`);
      }

      if (continuingStudents.length > 0) {
        console.log(`📚 Updating ${continuingStudents.length} continuing students...`);
        for (const student of continuingStudents) {
          await Student.findByIdAndUpdate(
            student._id,
            {
              $set: {
                enrollments: [],
                enrollmentCount: 0,
                semester: student.newSemester.toString(),
              },
            },
            { session }
          );
        }
        console.log(`✅ ${continuingStudents.length} students promoted to next semester`);
      }

      console.log("📋 Processing class sections...");
      const sectionsToUpdate = await ClassSection.find({}, null, { session });
      for (const classSection of sectionsToUpdate) {
        let newSemester = parseInt(classSection.semester) || 1;
        newSemester = newSemester >= 8 ? 1 : newSemester + 1;

        await ClassSection.findByIdAndUpdate(
          classSection._id,
          {
            $set: {
              assignedTeacher: null,
              assignedAt: null,
              students: [],
              enrolledStudents: 0,
              semester: newSemester.toString(),
            },
          },
          { session }
        );
      }

      console.log("📚 Processing classes...");
      const classesToUpdate = await Class.find({}, null, { session });
      for (const classItem of classesToUpdate) {
        let newSemester = parseInt(classItem.semester) || 1;
        newSemester = newSemester >= 8 ? 1 : newSemester + 1;
        const newClassName = `${classItem.program} ${newSemester} ${classItem.sections.sort().join("")}`;

        await Class.findByIdAndUpdate(
          classItem._id,
          {
            $set: {
              semester: newSemester,
              className: newClassName,
              subjects: [],
              updatedAt: new Date(),
            },
          },
          { session }
        );
      }

      console.log("🗑️ Clearing registration requests...");
      await RegistrationRequest.deleteMany({}, { session });

      const sessionData = {
        sessionType: activeSession.sessionType,
        year: activeSession.year,
        startDate: activeSession.startDate,
        endDate: new Date(),
        teachersProcessed: teachers.length,
        studentsProcessed: students.length,
        graduatedStudents: graduatedStudents.length,
        continuingStudents: continuingStudents.length,
        classesProcessed: classes.length,
        sectionsProcessed: classSections.length,
        subjectsCleared: true,
      };
      const excelReport = await generateExcelReport(sessionData, graduatedStudents);

      await Session.findByIdAndUpdate(
        activeSession._id,
        {
          $set: {
            isActive: false,
            endDate: new Date(),
            sessionData: {
              teachers,
              students,
              graduates: graduatedStudents,
              classes,
              classSections,
              registrationRequests,
              activities: activeSession.activities || [],
              statistics: sessionStatistics,
              teachersProcessed: teachers.length,
              studentsProcessed: students.length,
              graduatedStudents: graduatedStudents.length,
              continuingStudents: continuingStudents.length,
              classesProcessed: classes.length,
              sectionsProcessed: classSections.length,
              subjectsCleared: true,
              endedAt: new Date(),
            },
          },
        },
        { session }
      );

      await session.commitTransaction();
      console.log("✅ Session ended successfully!");

      return NextResponse.json({
        message: `Session ended successfully - ${graduatedStudents.length} students graduated, ${continuingStudents.length} students promoted`,
        sessionData,
        excelReport,
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("❌ Transaction error:", error);
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("❌ Error ending session:", error);
    return NextResponse.json({ message: "Failed to end session", error: error.message }, { status: 500 });
  }
}
