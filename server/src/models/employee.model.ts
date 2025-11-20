import mongoose from "mongoose";
import type { EmployeeType } from "../types/schema";

const employeeSchema = new mongoose.Schema<EmployeeType>({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Company",
		required: true,
	},

	position: { type: String, required: true },

	department: String,

	startDate: Date,

	endDate: Date,

	isVerified: { type: Boolean, default: false },

	isCurrent: { type: Boolean, default: true },
});

const Employee = mongoose.model<EmployeeType>("Employee", employeeSchema);

export default Employee;
