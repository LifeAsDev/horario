"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import CreateBlockModal from "@/src/components/createBlockModal/createBlockModal";

function formatToTimeString(minutes: number): string {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = "00";

  return `${formattedMinutes}:${formattedSeconds}`;
}
function darkenHexColor(hex?: string, amount?: number): string | undefined {
  if (!hex || !amount) return undefined;
  // Asegúrate de que el color comienza con "#" (si no, agregamos uno)
  if (hex.startsWith("#")) {
    hex = hex.substring(1);
  }

  // Asegúrate de que el color sea de 6 caracteres (HEX válido)
  if (hex.length !== 6) {
    throw new Error("El color HEX debe ser de 6 caracteres.");
  }

  // Convertir el valor HEX a componentes RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Oscurecer cada componente (restando el valor "amount")
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Volver a convertir los valores RGB a HEX
  const darkenedHex = `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .padStart(6, "0")}`;

  return darkenedHex;
}

const randomHexColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const color = `#${randomColor.padStart(6, "0")}`; // Asegura 6 caracteres
  return color;
};

export interface ScheduleBlock {
  day: string; // El día de la semana (por ejemplo, 'Lunes', 'Martes', etc.)
  startTime: number; // Hora de inicio en minutos desde las 08:00 AM
  duration: number; // Duración en minutos (por ejemplo, 60 minutos)
  activity: string; // Descripción de la actividad (por ejemplo, 'Reunión', 'Estudio')
  id: string; // Identificador único para cada bloque (puede ser generado con un UUID)
  color?: string;
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
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlock[]>([]);
  const [newConfirmBlock, setNewConfirmBlock] = useState<ScheduleBlock | null>(
    null
  );
  const [editConfirmBlock, setEditConfirmBlock] =
    useState<ScheduleBlock | null>(null);

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
          const maxDurationByTable = 960 - blockToResize.startTime;

          // Si hay solapamiento, no permitir el cambio de tamaño
          if (!isOverlapping) {
            blockToResize.duration = blockToResize.duration = Math.min(
              newDuration,
              maxDurationByTable
            );
          }
        }

        return newScheduleBlocks;
      });

      setHeight(snappedHeight);
    }
    if (isDragging) {
      const deltaY = e.clientY - dragStartY;

      // Convertir deltaY a minutos
      const deltaMinutes = Math.round((deltaY / 32) * 60);
      const table = document.getElementById("table");
      const clickY = e.clientY - table!.getBoundingClientRect().top - 48;
      const deltaYDrag = Math.round(((clickY / 32) * 60) / 15) * 15;

      const newStartTime =
        Math.round((originalStartTime + deltaMinutes) / 15) * 15;

      setScheduleBlocks((prev) => {
        const newScheduleBlocks = [...prev];
        const blockToMove = newScheduleBlocks.find(
          (item) => item.id === isDragging
        );

        if (!blockToMove) return prev; // Si no existe el bloque, no hacemos nada

        const dayBlocks = newScheduleBlocks.filter(
          (block) =>
            block.day === blockToMove.day && block.id !== blockToMove.id
        );

        // Crear una lista de intervalos ocupados
        const occupiedIntervals = dayBlocks.map((block) => ({
          start: block.startTime,
          end: block.startTime + block.duration,
        }));

        // Ordenar los intervalos ocupados por hora de inicio
        occupiedIntervals.sort((a, b) => a.start - b.start);

        // Crear intervalos disponibles
        const availableIntervals: { start: number; end: number }[] = [];
        let previousEnd = 0;
        const maxEnd = 960;

        for (const interval of occupiedIntervals) {
          if (
            previousEnd < interval.start &&
            interval.start - previousEnd >= blockToMove.duration
          ) {
            availableIntervals.push({
              start: previousEnd,
              end: interval.start,
            });
          }
          previousEnd = Math.max(previousEnd, interval.end);
        }
        // Agregar el último intervalo si queda espacio
        if (previousEnd < maxEnd) {
          availableIntervals.push({ start: previousEnd, end: maxEnd });
        }

        // Revisar dónde encaja el bloque que se mueve
        const blockEndTime = newStartTime + blockToMove.duration;

        const validInterval = availableIntervals.find(
          (interval) =>
            newStartTime >= interval.start && blockEndTime <= interval.end
        );

        if (validInterval) {
          // Si hay un intervalo válido, asignar la nueva posición
          const updatedBlock = { ...blockToMove, startTime: newStartTime };
          return newScheduleBlocks.map((block) =>
            block.id === blockToMove.id ? updatedBlock : block
          );
        }

        // Si no hay intervalo válido, intentar ajustarlo automáticamente
        /*    const closestInterval = availableIntervals
          .map((interval) => ({ distance: 1 }))
          .find(
            (interval) => interval.end - interval.start >= blockToMove.duration
          ); */

        const intervalSort: {
          direction: "up" | "down";
          y: number;
          distance: number;
        }[] = [];
        availableIntervals.map((interval) => {
          intervalSort.push({
            direction: "up",
            y: interval.end,
            distance: Math.abs(deltaYDrag - interval.end),
          });
          intervalSort.push({
            direction: "down",
            y: interval.start,
            distance: Math.abs(deltaYDrag - interval.start),
          });
        });

        intervalSort.sort((a, b) => a.distance - b.distance);

        const closestInterval = intervalSort[0];

        if (closestInterval) {
          // Ajustar el bloque al inicio del hueco más cercano
          let updateStartTime = 0;
          if (closestInterval.direction === "down")
            updateStartTime = closestInterval.y;
          else updateStartTime = closestInterval.y - blockToMove.duration;
          const updatedBlock = {
            ...blockToMove,
            startTime: updateStartTime,
          };

          return newScheduleBlocks.map((block) =>
            block.id === blockToMove.id ? updatedBlock : block
          );
        }

        // Si no hay espacio suficiente, devolvemos el estado sin cambios
        return prev;
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

  const confirmNewBlock = () => {
    const newBlock: ScheduleBlock = newConfirmBlock!;

    setScheduleBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  const confirmEditBlock = () => {
    const updatedBlock: ScheduleBlock = editConfirmBlock!;

    setScheduleBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block
      )
    );
  };

  const handleCreateBlock = (e: React.MouseEvent, day: string) => {
    // Calcular la hora de inicio en minutos basándote en la posición del clic
    const clickY = e.clientY - e.currentTarget.getBoundingClientRect().top - 32;
    const newStartTime = Math.floor(clickY / 32) * 60; // Ajuste al múltiplo de 60 minutos
    const color = randomHexColor();
    const newBlock: ScheduleBlock = {
      day,
      startTime: newStartTime,
      duration: 60, // Duración por defecto de 60 minutos
      activity: "bloque",
      id: `block-${Date.now()}`, // ID único
      color,
    };
    const isOverlapping = scheduleBlocks.some((block) => {
      if (block.day !== newBlock.day) return false; // Comparar solo bloques del mismo día

      const blockEndTime = block.startTime + block.duration;
      const newBlockEndTime = newBlock.startTime + newBlock.duration;

      // Comprobar si hay solapamiento
      return (
        newBlock.startTime < blockEndTime && newBlockEndTime > block.startTime
      );
    });
    if (!isOverlapping) {
      setNewConfirmBlock(newBlock);
    }
  };

  const handleEditBlock = (block: ScheduleBlock) => {
    setEditConfirmBlock(block);
  };

  // Función para manejar la eliminación de un bloque específico
  const handleDeleteBlock = (blockId: string) => {
    setScheduleBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== blockId)
    );
  };
  useEffect(() => {
    const data = localStorage.getItem("scheduleBlocks");
    if (data) {
      setScheduleBlocks(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scheduleBlocks", JSON.stringify(scheduleBlocks)); // Convertir a string para guardar
  }, [scheduleBlocks]);

  return (
    <main className={styles.main}>
      {newConfirmBlock && (
        <CreateBlockModal
          scheduleBlock={newConfirmBlock}
          setScheduleBlock={setNewConfirmBlock}
          createBlock={() => {
            confirmNewBlock();
            setNewConfirmBlock(null);
          }}
          back={() => {
            setNewConfirmBlock(null);
          }}
        />
      )}
      {editConfirmBlock && (
        <CreateBlockModal
          scheduleBlock={editConfirmBlock}
          setScheduleBlock={setEditConfirmBlock}
          createBlock={() => {
            confirmEditBlock();
            setEditConfirmBlock(null);
          }}
          back={() => {
            setEditConfirmBlock(null);
          }}
          mode={"edit"}
        />
      )}
      <div
        className={styles.table}
        id="table"
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
            key={row}
            onClick={(e) => handleCreateBlock(e, row)}
            className={`${styles.row} ${row === "Hora" && styles.rowHour}`}
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
                    style={
                      {
                        height: convertDurationToHeight(block.duration),
                        top: convertDurationToHeight(block.startTime) + 32,
                        "--blockColor": block.color,
                        "--blockBorderColor": darkenHexColor(block.color, 40),
                      } as React.CSSProperties
                    }
                    onContextMenu={(e) => {
                      e.preventDefault(); // Prevenir el menú contextual predeterminado
                      handleDeleteBlock(block.id); // Eliminar el bloque al hacer clic derecho
                    }}
                    onDoubleClick={() => {
                      handleEditBlock(block);
                    }}
                  >
                    {block.activity}
                    <div
                      className={styles.rezizeHandler}
                      onMouseDown={(e) => handleMouseDown(e, block)}
                      style={{
                        cursor: !isDragging ? "ns-resize" : "grabbing",
                      }}
                    />
                    <div
                      style={{
                        cursor: isResizing
                          ? "ns-resize"
                          : isDragging
                          ? "grabbing"
                          : "grab",
                      }}
                      className={styles.dragHandler}
                      onMouseDown={(e) => handleDragStart(e, block)}
                    />
                  </div>
                )
            )}
            {scheduleBlocks.map(
              (block) =>
                block.day === row && (
                  <div
                    key={`${block.id}${block.id}`}
                    className={styles.columnBlockSpan}
                  >
                    {block.activity}
                  </div>
                )
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
