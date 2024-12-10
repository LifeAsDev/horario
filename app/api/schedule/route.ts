import { connectMongoDB } from "@/src/lib/mongodb";
import ScheduleBlocks from "@/src/schemas/scheduleBlocks";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const scheduleName = searchParams.get("scheduleName");
	if (scheduleName === "" || !scheduleName)
		return NextResponse.json(
			{
				message: "Schedule name invalid",
			},
			{ status: 400 }
		);

	await connectMongoDB();

	const schedule = await ScheduleBlocks.findOne({ name: scheduleName });
	if (schedule)
		return NextResponse.json(
			{
				schedule,
				message: "Schedule found",
			},
			{ status: 200 }
		);
	else
		return NextResponse.json(
			{
				message: "Schedule not found",
				schedule: false,
			},
			{ status: 200 }
		);
}

export async function DELETE(req: Request) {
	const { searchParams } = new URL(req.url);
	const scheduleName = searchParams.get("scheduleName");

	if (scheduleName === "" || !scheduleName)
		return NextResponse.json(
			{
				message: "Schedule name invalid",
			},
			{ status: 400 }
		);

	await connectMongoDB();

	const schedule = await ScheduleBlocks.findOneAndDelete({
		name: scheduleName,
	});
	if (schedule)
		return NextResponse.json(
			{
				message: "Schedule deleted successfully",
				schedule,
			},
			{ status: 200 }
		);
	else
		return NextResponse.json(
			{
				message: "Schedule not found",
				schedule: false,
			},
			{ status: 404 }
		);
}

export async function POST(req: Request) {
	try {
		const { name, blocks } = await req.json();

		// Validación de datos
		if (!name || name.trim() === "") {
			return NextResponse.json(
				{
					message: "Schedule name is required",
				},
				{ status: 400 }
			);
		}

		// Conexión a MongoDB
		await connectMongoDB();

		// Crear o actualizar el documento
		const schedule = await ScheduleBlocks.findOneAndUpdate(
			{ name }, // Filtro: Busca por nombre
			{ name, blocks }, // Datos a actualizar o insertar
			{ new: true, upsert: true } // Crea si no existe (upsert), devuelve el documento actualizado
		);

		return NextResponse.json(
			{
				schedule,
				message: "Schedule created or updated successfully",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log({ error });
		return NextResponse.json(
			{
				message: "An error occurred while processing the request",
				error,
			},
			{ status: 500 }
		);
	}
}
