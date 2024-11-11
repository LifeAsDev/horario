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
  const [isDragging, setIsDragging] = useState<false | string>(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [originalStartTime, setOriginalStartTime] = useState(0);
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
                // Calcular la duración máxima permitida antes de solaparse con `item`
                const maxAllowedDuration =
                  item.startTime - blockToResize.startTime;

                // Ajustar el bloque para que no se solape
                blockToResize.duration = Math.min(
                  newDuration,
                  maxAllowedDuration
                );

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
    if (isDragging) {
      const deltaY = e.clientY - dragStartY;
      let newStartTime =
        Math.round((originalStartTime + (deltaY / 32) * 60) / 15) * 15;

      setScheduleBlocks((prev) => {
        const newScheduleBlocks = [...prev];
        const blockToMove = newScheduleBlocks.find(
          (item) => item.id === isDragging
        );
        if (blockToMove) {
          const isOverlapping = newScheduleBlocks.some((item) => {
            if (item.id === blockToMove.id) return false;

            if (item.day === blockToMove.day) {
              const blockEndTime = newStartTime + blockToMove.duration;
              const itemEndTime = item.startTime + item.duration;

              if (newStartTime < itemEndTime && blockEndTime > item.startTime) {
                newStartTime =
                  newStartTime < item.startTime
                    ? item.startTime - blockToMove.duration
                    : itemEndTime;

                return false;
              }
            }
            return false;
          });

          if (!isOverlapping && newStartTime >= 0 && newStartTime <= 960) {
            blockToMove.startTime = newStartTime;
          }
        }
        return newScheduleBlocks;
      });
    }
  };

  // Manejador para detener el resizing
  const handleMouseUp = () => {
    setIsResizing(false);
    setIsDragging(false);
  };

  // Agregar y remover listeners de mouse cuando sea necesario
  useEffect(() => {
    if (isResizing || isDragging) {
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
  }, [isResizing, isDragging]);

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
  const handleDragStart = (e: React.MouseEvent, block: ScheduleBlock) => {
    setIsDragging(block.id);
    setDragStartY(e.clientY);
    setOriginalStartTime(block.startTime);
    e.preventDefault();
  };
  const handleCreateBlock = (e: React.MouseEvent, day: string) => {
    // Calcular la hora de inicio en minutos basándote en la posición del clic
    const clickY = e.clientY - e.currentTarget.getBoundingClientRect().top - 32;
    const newStartTime = Math.floor(clickY / 32) * 60; // Ajuste al múltiplo de 60 minutos

    const newBlock: ScheduleBlock = {
      day,
      startTime: newStartTime,
      duration: 60, // Duración por defecto de 60 minutos
      activity: "bloque",
      id: `block-${Date.now()}`, // ID único
    };

    // Verificar si el nuevo bloque se solapa con algún bloque existente
    const isOverlapping = scheduleBlocks.some((block) => {
      if (block.day !== newBlock.day) return false; // Comparar solo bloques del mismo día

      const blockEndTime = block.startTime + block.duration;
      const newBlockEndTime = newBlock.startTime + newBlock.duration;

      // Comprobar si hay solapamiento
      return (
        newBlock.startTime < blockEndTime && newBlockEndTime > block.startTime
      );
    });

    // Si no hay solapamiento, agregar el nuevo bloque
    if (!isOverlapping) {
      setScheduleBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    }
  };
  // Función para manejar la eliminación de un bloque específico
  const handleDeleteBlock = (blockId: string) => {
    setScheduleBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== blockId)
    );
  };

  return (
    <main className={styles.main}>
      <div
        className={styles.table}
        style={{
          cursor: isResizing
            ? "ns-resize"
            : isDragging
            ? "grabbing"
            : "default",
        }}
      >
        {tableHeaderRow.map((row) => (
          <div
            onClick={(e) => handleCreateBlock(e, row)}
            key={row}
            className={styles.row}
          >
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
                    onContextMenu={(e) => {
                      e.preventDefault(); // Prevenir el menú contextual predeterminado
                      handleDeleteBlock(block.id); // Eliminar el bloque al hacer clic derecho
                    }}
                  >
                    {block.activity}
                    <div
                      className={styles.rezizeHandler}
                      onMouseDown={(e) => handleMouseDown(e, block)}
                    />
                    <div
                      style={{
                        cursor: isDragging ? "grabbing" : "grab ",
                      }}
                      className={styles.dragHandler}
                      onMouseDown={(e) => handleDragStart(e, block)}
                    />
                  </div>
                )
            )}
            <div></div>
          </div>
        ))}
      </div>
    </main>
  );
}
