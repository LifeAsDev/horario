import styles from "./styles.module.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import ScheduleBlocks from "@/src/models/scheduleBlocks";

export default function CreateLayerModal({
	scheduleBlocks,
	setScheduleBlocks,
	create,
	back,
	mode,
}: {
	scheduleBlocks: ScheduleBlocks;
	setScheduleBlocks: Dispatch<SetStateAction<ScheduleBlocks | null>>;
	create: () => void;
	back: () => void;
	mode?: string;
}) {
	const activityInputRef = useRef<HTMLInputElement>(null);

	// Enfocar el input al cargar el componente
	useEffect(() => {
		activityInputRef.current?.focus();
	}, []);
	return (
		<div className={styles.overlay}>
			<div className={styles.mainBox}>
				<h2>{mode === "edit" ? "Editar" : "Crear"} Capa</h2>
				<div className={styles.inputBox}>
					<label htmlFor="activity">Capa</label>
					<input
						ref={activityInputRef} // Asignamos la ref al input
						placeholder="Nombre de capa"
						id="capa"
						type="text"
						value={scheduleBlocks.name}
						onChange={(e) =>
							setScheduleBlocks((prev) => {
								const newPrev = {
									...prev,
									name: e.target.value,
								} as ScheduleBlocks;
								return newPrev;
							})
						}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								create(); // Llama a tu función aquí
							}
						}}
					/>
				</div>
				<div className={styles.buttonBox}>
					<button onClick={back} type="button">
						Volver
					</button>
					<button onClick={create} type="button">
						{mode === "edit" ? "Editar" : "Crear"}
					</button>
				</div>
			</div>
		</div>
	);
}
