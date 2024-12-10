import { ScheduleBlock } from "@/src/components/scheduleTable/scheduleTable";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export default function DeleteScheduleModal({
	scheduleName,
	onDelete,
	back,
}: {
	scheduleName: string;
	onDelete: () => void;
	back: () => void;
}) {
	return (
		<div className={styles.overlay}>
			<div className={styles.mainBox}>
				<h2>Borrar horario</h2>
				<p>
					Estas seguro que deseas borrar
					<span className={styles.red}> {scheduleName}</span>?
				</p>
				<div className={styles.buttonBox}>
					<button onClick={back} type="button">
						Volver
					</button>
					<button onClick={onDelete} type="button">
						Borrar
					</button>
				</div>
			</div>
		</div>
	);
}
