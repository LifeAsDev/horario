"use client";
import { useState } from "react";
import styles from "./styles.module.css";

function formatToTimeString(minutes: number): string {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = "00";

  return `${formattedMinutes}:${formattedSeconds}`;
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

  return (
    <main className={styles.main}>
      <div className={styles.table}>
        {tableHeaderRow.map((row) => (
          <div className={styles.row}>
            <div className={styles.rowHeader}> {row}</div>
            {row === "Hora" &&
              tableHourColumn.map((hour) => (
                <div className={styles.columnBlock}>
                  {formatToTimeString(hour)}
                </div>
              ))}
          </div>
        ))}
      </div>
    </main>
  );
}
