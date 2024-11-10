"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

function formatToTimeString(minutes: number): string {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = "00";

  return `${formattedMinutes}:${formattedSeconds}`;
}

interface ScheduleBlock {
  day: string; // El día de la semana (por ejemplo, 'Lunes', 'Martes', etc.)
  startTime: number; // Hora de inicio en minutos desde las 08:00 AM
  duration: number; // Duración en minutos (por ejemplo, 60 minutos)
  activity: string; // Descripción de la actividad (por ejemplo, 'Reunión', 'Estudio')
  id: string; // Identificador único para cada bloque (puede ser generado con un UUID)
}

export default function ScheduleTable() {
  const [tableHeaderRow, setTableHeaderRow] = useState([
    "Hora",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ]);
  const [tableHourColumn, setTableHourColumn] = useState(
    Array.from({ length: 16 }, (_, index) => index + 8)
  );
  /*   const [activityBlocks, setActivityBlocks];
   */
  const [height, setHeight] = useState(160); // Altura inicial
  const [isResizing, setIsResizing] = useState<false | string>(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(200); // Altura inicial en el momento del clic
  const SNAP_SIZE = 8; // Tamaño de snap en píxeles
  const MIN_SIZE = 8;

  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([
    {
      day: "Lunes",
      startTime: 120,
      duration: 60, // 60 minutos
      activity: "Reunión de equipo",
      id: "block-1",
    },
    {
      day: "Lunes",
      startTime: 480,
      duration: 120, // 120 minutos
      activity: "Estudio de matemáticas",
      id: "block-2",
    },
  ]);

  // Manejador para iniciar el resizing
  const handleMouseDown = (e: React.MouseEvent, block: ScheduleBlock) => {
    setIsResizing(block.id);
    setStartY(e.clientY);
    setStartHeight(convertDurationToHeight(block.duration)); // Guarda la altura inicial

    e.preventDefault();
  };

  // Manejador para actualizar el tamaño mientras se arrastra
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const deltaHeight = e.clientY - startY;
      const newHeight = startHeight + deltaHeight;

      // Ajuste de la altura al múltiplo de 32 más cercano
      const snappedHeight = Math.max(
        Math.round(newHeight / SNAP_SIZE) * SNAP_SIZE,
        MIN_SIZE
      );

      // Convertir la altura a duración en minutos
      const newDuration = convertHeightToDuration(snappedHeight);

      // Verificar solapamientos antes de actualizar el bloque
      setScheduleBlocks((prev) => {
        const newScheduleBlocks = [...prev];

        // Encontrar el bloque que se está redimensionando
        const resizedBlockIndex = newScheduleBlocks.findIndex(
          (item) => item.id === isResizing
        );

        if (resizedBlockIndex !== -1) {
          const blockToResize = newScheduleBlocks[resizedBlockIndex];

          // Verificar que el bloque redimensionado no se solape con otros
          const isOverlapping = newScheduleBlocks.some((item) => {
            // No comparar con el mismo bloque
            if (item.id === blockToResize.id) return false;

            // Si el bloque actual está en el mismo día, verificar solapamientos
            if (item.day === blockToResize.day) {
              const blockEndTime = blockToResize.startTime + newDuration;
              const itemEndTime = item.startTime + item.duration;

              // Comprobar si hay solapamiento
              if (
                blockToResize.startTime < itemEndTime &&
                blockEndTime > item.startTime
              ) {
                return true;
              }
            }
            return false;
          });

          // Si hay solapamiento, no permitir el cambio de tamaño
          if (!isOverlapping) {
            blockToResize.duration = newDuration;
          }
        }

        return newScheduleBlocks;
      });

      setHeight(snappedHeight);
    }
  };

  // Manejador para detener el resizing
  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Agregar y remover listeners de mouse cuando sea necesario
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const convertDurationToHeight = (duration: number): number => {
    return (duration / 60) * 32; // 32px por cada 60 minutos
  };
  const convertHeightToDuration = (height: number): number => {
    return (height / 32) * 60; // 32px por cada 60 minutos
  };
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    console.log((hours - 8) * 60 + minutes);
    return (hours - 8) * 60 + minutes; // Resta 8 horas para que comience desde 08:00 AM
  };

  return (
    <main className={styles.main}>
      <div
        className={styles.table}
        style={{ cursor: isResizing ? "ns-resize" : "default" }}
      >
        {tableHeaderRow.map((row) => (
          <div key={row} className={styles.row}>
            <div className={styles.rowHeader}>{row}</div>
            {row === "Hora" &&
              tableHourColumn.map((hour) => (
                <div key={hour} className={styles.columnHour}>
                  {formatToTimeString(hour)}
                </div>
              ))}
            {scheduleBlocks.map(
              (block) =>
                block.day === row && (
                  <div
                    key={block.id}
                    className={styles.columnBlock}
                    style={{
                      height: convertDurationToHeight(block.duration),
                      top: 32 + convertDurationToHeight(block.startTime),
                    }}
                  >
                    {block.activity}
                    <div
                      className={styles.rezizeHandler}
                      onMouseDown={(e) => handleMouseDown(e, block)}
                    />
                  </div>
                )
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
