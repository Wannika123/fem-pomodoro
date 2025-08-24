import { useEffect, useRef, useState } from "react";
import type { AudioValue } from "./Pomodoro";
import type { TickSoundType, AlarmSoundType } from "../lib/settingOptions";
import styles from "./Timer.module.css";
import useSound from "../hooks/useSound";
import { findFilePath } from "../lib/audioFilePath";

type Props = {
    time: number;
    tick: AudioValue<TickSoundType>;
    alarm: AudioValue<AlarmSoundType>;
    settingModalOpen: boolean;
};

export default function Timer({ time, tick, alarm, settingModalOpen }: Props) {
    const fullTime = time * 60;

    const [secondsRemaining, setSecondsRemaining] = useState(fullTime);
    const [countingDown, setCountingDown] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { startAudio, stopAudio } = useSound();

    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;

    const circleRef = useRef<SVGCircleElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const percent = (secondsRemaining * 100) / fullTime;

    // prettier-ignore
    const btnLabel = countingDown
        ? "pause"
        : secondsRemaining === 0
            ? "restart"
            : "start";

    const twoDigits = (num: number) => {
        const str = num.toString();

        if (str.length == 1) {
            return "0" + str;
        }
        return str;
    };

    useEffect(() => {
        setSecondsRemaining(time * 60);
        setCountingDown(false);
        stopAudio();
    }, [time]);

    useEffect(() => {
        if (!countingDown) return;

        const count = setInterval(() => {
            if (secondsRemaining === 0) {
                clearInterval(count);
                setDialogOpen(true);
                setCountingDown(false);
            }
            setSecondsRemaining((prevState) => {
                if (prevState > 0) {
                    return prevState - 1;
                } else {
                    return 0;
                }
            });
        }, 1000);

        return () => {
            clearInterval(count);
        };
    }, [secondsRemaining, countingDown]);

    useEffect(() => {
        if (tick.sound === "off") return;

        if (countingDown) {
            startAudio(findFilePath(tick.sound), tick.gain, true);
        } else {
            stopAudio();
            if (secondsRemaining === 0 && alarm.sound !== "off") {
                startAudio(findFilePath(alarm.sound), alarm.gain, true);
            }
        }
    }, [countingDown]);

    useEffect(() => {
        circleRef.current?.style.setProperty("--Percent", percent.toString());
    }, [percent]);

    useEffect(() => {
        if (settingModalOpen) {
            stopAudio();
            setCountingDown(false);
            setSecondsRemaining(time * 60);
        }
    }, [settingModalOpen]);

    useEffect(() => {
        if (!dialogRef.current) return;

        if (dialogOpen) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [dialogOpen]);

    return (
        <div className={styles.container}>
            <div>
                <div className={styles["outer-circle"]}>
                    <div className={styles["svg-wrapper"]}>
                        <svg>
                            <circle
                                r="40%"
                                cx="50%"
                                cy="50%"
                                ref={circleRef}
                            ></circle>
                        </svg>
                    </div>
                    <div className={styles["inner-circle"]}>
                        <div className={styles["time-display"]}>
                            <h1>
                                {twoDigits(minutes)}:{twoDigits(seconds)}
                            </h1>
                            <button
                                onClick={() => setCountingDown((prev) => !prev)}
                                className={styles["count-btn"]}
                            >
                                {btnLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <dialog className={styles.dialog} ref={dialogRef}>
                <h2>Timer Done!</h2>
                <button
                    onClick={() => {
                        stopAudio();
                        setDialogOpen(false);
                        setSecondsRemaining(time * 60);
                    }}
                >
                    OK
                </button>
            </dialog>
        </div>
    );
}
