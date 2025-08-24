import type { Mode } from "./Pomodoro";
import styles from "./PomoHeader.module.css";

type Props = {
    mode: Mode;
    changeMode: (mode: Mode) => void;
};

export default function PomoHeader({ mode, changeMode }: Props) {
    return (
        <div className={styles.container}>
            <button
                className={mode === "pomodoro" ? styles.selected : undefined}
                onClick={() => changeMode("pomodoro")}
            >
                pomodoro
            </button>
            <button
                className={mode === "short break" ? styles.selected : undefined}
                onClick={() => changeMode("short break")}
            >
                short break
            </button>
            <button
                className={mode === "long break" ? styles.selected : undefined}
                onClick={() => changeMode("long break")}
            >
                long break
            </button>
        </div>
    );
}
