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
                onClick={(e) => {
                  setScheduleBlock((prev) => {
                    const newPrev = {
                      ...prev,
                      color,
                    } as ScheduleBlock;
                    return newPrev;
                  });
                }}
                key={color}
                style={{ "--color": color } as React.CSSProperties}
                className={`${styles.colorRounded} ${
                  color === scheduleBlock.color && styles.colorSelect
                }`}
              >
                {/*    {color === scheduleBlock.color && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M4 12.6111L8.92308 17.5L20 6.5"
                        stroke="#ffffff"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                )} */}
              </div>
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
