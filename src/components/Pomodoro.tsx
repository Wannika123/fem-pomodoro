import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.svg";
import settingIcon from "../assets/icon-settings.svg";
import styles from "./Pomodoro.module.css";
import PomoHeader from "./PomoHeader";
import Settings from "./Settings";
import Timer from "./Timer";
import type {
    Mode,
    ColorType,
    FontType,
    TickSoundType,
    AlarmSoundType,
} from "../lib/settingOptions";

export type AudioValue<T> = {
    sound: T | "off";
    gain: number;
};

export type SettingValues = {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
    font: FontType;
    color: ColorType;
    tick: AudioValue<TickSoundType>;
    alarm: AudioValue<AlarmSoundType>;
};

const INITIAL_VALUES: SettingValues = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    font: "Kumbh Sans",
    color: "Red",
    tick: {
        sound: "cinematic",
        gain: 0.8,
    },
    alarm: {
        sound: "marimba",
        gain: 0.8,
    },
};

export default function Pomodoro() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<Mode>("pomodoro");
    const [values, setValues] = useState<SettingValues>(INITIAL_VALUES);

    let time: number;
    if (mode === "pomodoro") {
        time = values.pomodoro;
    } else if (mode === "short break") {
        time = values.shortBreak;
    } else {
        time = values.longBreak;
    }

    const changeMode = (mode: Mode) => {
        setMode(mode);
    };

    useEffect(() => {
        document.body.style.setProperty(
            "--Selected-Color",
            `var(--${values.color})`
        );
    }, [values.color]);

    useEffect(() => {
        document.body.style.fontFamily = values.font;
    }, [values.font]);

    useEffect(() => {
        if (!dialogRef.current) return;

        if (modalOpen) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [modalOpen]);

    return (
        <div className={styles.container}>
            <img className={styles.logo} src={logo} alt="logo" />

            <PomoHeader mode={mode} changeMode={changeMode} />

            <Timer
                time={time}
                tick={values.tick}
                alarm={values.alarm}
                settingModalOpen={modalOpen}
            />

            <button
                className={styles["setting-btn"]}
                aria-label="setting button"
                onClick={() => setModalOpen(true)}
            >
                <img src={settingIcon} alt="setting icon" />
            </button>

            <dialog ref={dialogRef} className={styles.dialog}>
                <Settings
                    isOpen={modalOpen}
                    setIsOpen={setModalOpen}
                    values={values}
                    setValues={setValues}
                />
            </dialog>
        </div>
    );
}
