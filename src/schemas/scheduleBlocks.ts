import ScheduleBlocks from "@/src/models/scheduleBlocks";
import mongoose, { Schema, models } from "mongoose";
import { ScheduleBlock } from "@/src/components/scheduleTable/scheduleTable";

const scheduleBlockSchema = new Schema<ScheduleBlock>({
	day: { type: String, required: true },
	startTime: { type: Number, required: true },
	duration: Number,
	activity: { type: String, required: true },
	id: String,
	color: { type: String, required: false },
});

const scheduleBlocksSchema = new Schema<ScheduleBlocks>(
	{
		name: {
			type: String,
			default: "",
		},
		blocks: [scheduleBlockSchema],
	},
	{ timestamps: true }
);

export default mongoose.models?.ScheduleBlocks ||
	mongoose.model("ScheduleBlocks", scheduleBlocksSchema);
