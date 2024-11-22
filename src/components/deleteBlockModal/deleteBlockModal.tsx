import { ScheduleBlock } from "@/src/components/scheduleTable/scheduleTable";
import styles from "./styles.module.css";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export default function DeleteBlockModal({
  deleteBlock,
  back,
  blockCount = 0,
}: {
  deleteBlock: () => void;
  back: () => void;
  blockCount?: number;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.mainBox}>
        <h2>Borrar bloques</h2>
        <p>
          Estas seguro que deseas borrar
          <span className={styles.red}> {blockCount}</span> bloques?
        </p>
        <div className={styles.buttonBox}>
          <button onClick={back} type="button">
            Volver
          </button>
          <button onClick={deleteBlock} type="button">
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
