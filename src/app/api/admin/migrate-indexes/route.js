import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        await connectDB();

        const db = mongoose.connection.db;
        const collection = db.collection('classsections');

        // List current indexes
        const indexes = await collection.indexes();
        console.log('📋 Current indexes:', indexes.map(i => i.name));

        // Drop old index if it exists
        try {
            await collection.dropIndex('classId_1_section_1_subject_1');
            console.log('✅ Dropped old index: classId_1_section_1_subject_1');
        } catch (error) {
            if (error.code === 27) {
                console.log('ℹ️  Index already dropped');
            } else {
                throw error;
            }
        }

        // List updated indexes
        const updatedIndexes = await collection.indexes();
        console.log('📋 Updated indexes:', updatedIndexes.map(i => i.name));

        return NextResponse.json({
            message: "Index migration complete",
            oldIndexes: indexes.map(i => i.name),
            newIndexes: updatedIndexes.map(i => i.name)
        }, { status: 200 });

    } catch (error) {
        console.error("❌ Error during migration:", error);
        return NextResponse.json({
            message: "Migration failed",
            error: error.message
        }, { status: 500 });
    }
}
