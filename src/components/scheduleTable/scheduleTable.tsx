import styles from "./styles.module.css";
export default function ScheduleTable() {
  return (
    <main className={styles.main}>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>
                <div>Lunes</div>
              </th>
              <th>
                <div>Martes</div>
              </th>
              <th>
                <div>Miercoles</div>
              </th>
              <th>
                <div>Jueves</div>
              </th>
              <th>
                <div>Viernes</div>
              </th>
              <th>
                <div>Sabado</div>
              </th>
              <th>
                <div>Domingo</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>Cosa 1</div>
              </td>
              <td>
                <div>Cosa 2</div>
              </td>
              <td>
                <div>Cosa 3</div>
              </td>
              <td>
                <div>Cosa 4</div>
              </td>
              <td>
                <div>Cosa 5</div>
              </td>
              <td>
                <div>Cosa 6</div>
              </td>
              <td>
                <div>Cosa 7</div>
              </td>
            </tr>{" "}
            <tr>
              <td>
                <div>Cosa 1</div>
              </td>
              <td>
                <div>Cosa 2</div>
              </td>
              <td>
                <div>Cosa 3</div>
              </td>
              <td>
                <div>Cosa 4</div>
              </td>
              <td>
                <div>Cosa 5</div>
              </td>
              <td>
                <div>Cosa 6</div>
              </td>
              <td>
                <div>Cosa 7</div>
              </td>
            </tr>{" "}
            <tr>
              <td>
                <div>Cosa 1</div>
              </td>
              <td>
                <div>Cosa 2</div>
              </td>
              <td>
                <div>Cosa 3</div>
              </td>
              <td>
                <div>Cosa 4</div>
              </td>
              <td>
                <div>Cosa 5</div>
              </td>
              <td>
                <div>Cosa 6</div>
              </td>
              <td>
                <div>Cosa 7</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
