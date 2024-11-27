import { ScheduleBlock } from "@/src/components/scheduleTable/scheduleTable";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

const colors: string[] = [
  "#FF5733", // Rojo anaranjado
  "#33FF57", // Verde lima
  "#3357FF", // Azul brillante
  "#FF33A1", // Rosa intenso
  "#FFD733", // Amarillo
  "#33FFF7", // Turquesa
  "#A133FF", // Púrpura
  "#FF6F33", // Naranja brillante
  "#7499ad", // Verde claro
  "#37006f", // Azul suave
  "#FF3333", // Rojo vibrante
  "#33FFB8", // Verde agua
];

export default function CreateBlockModal({
  scheduleBlock,
  setScheduleBlock,
  createBlock,
  back,
  mode,
  hiddenCustomColor = true,
}: {
  scheduleBlock: ScheduleBlock;
  setScheduleBlock: Dispatch<SetStateAction<ScheduleBlock | null>>;
  createBlock: () => void;
  back: () => void;
  mode?: string;
  hiddenCustomColor?: boolean;
}) {
  const activityInputRef = useRef<HTMLInputElement>(null);

  // Enfocar el input al cargar el componente
  useEffect(() => {
    activityInputRef.current?.focus();
  }, []);
  return (
    <div className={styles.overlay}>
      <div className={styles.mainBox}>
        <h2>{mode === "edit" ? "Editar" : "Nuevo"} Bloque</h2>
        <div className={styles.inputBox}>
          <label htmlFor="activity">Actividad</label>
          <input
            ref={activityInputRef} // Asignamos la ref al input
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                createBlock(); // Llama a tu función aquí
              }
            }}
          />
        </div>
        <div className={styles.inputBox}>
          <label htmlFor="color">Color</label>
          {!hiddenCustomColor && (
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
          )}

          <div className={styles.colorBox}>
            {colors.map((color) => (
              <div
                key={color}
                style={{ "--color": color } as React.CSSProperties}
                className={styles.colorRounded}
              ></div>
            ))}
          </div>
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
