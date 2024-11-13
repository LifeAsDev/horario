import { ScheduleBlock } from "@/src/components/scheduleTable/scheduleTable";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction } from "react";

export default function CreateBlockModal({
  scheduleBlock,
  setScheduleBlock,
  createBlock,
  back,
  mode,
}: {
  scheduleBlock: ScheduleBlock;
  setScheduleBlock: Dispatch<SetStateAction<ScheduleBlock | null>>;
  createBlock: () => void;
  back: () => void;
  mode?: string;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.mainBox}>
        <h2>{mode === "edit" ? "Editar" : "Nuevo"} Bloque</h2>
        <div className={styles.inputBox}>
          <label htmlFor="activity">Actividad</label>
          <input
            placeholder="Nombre de actividad"
            id="activity"
            type="text"
            value={scheduleBlock.activity}
            onChange={(e) =>
              setScheduleBlock((prev) => {
                const newPrev = {
                  ...prev,
                  activity: e.target.value,
                } as ScheduleBlock;
                return newPrev;
              })
            }
          />
        </div>
        <div className={styles.inputBox}>
          <label htmlFor="color">Color</label>
          <input
            className={styles.colorInput}
            type="color"
            id="color"
            name="head"
            onChange={(e) => {
              setScheduleBlock((prev) => {
                const newPrev = {
                  ...prev,
                  color: e.target.value,
                } as ScheduleBlock;
                return newPrev;
              });
            }}
            defaultValue={scheduleBlock.color}
          />
        </div>
        <div className={styles.buttonBox}>
          <button onClick={back} type="button">
            Volver
          </button>
          <button onClick={createBlock} type="button">
            {mode === "edit" ? "Editar" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
