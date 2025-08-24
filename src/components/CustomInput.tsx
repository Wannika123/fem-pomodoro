import styles from "./CustomInput.module.css";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

type Props = {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
};

export default function CustomInput({ value, setValue }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [focusing, setFocusing] = useState(false);

    const changeValByStep = (n: number) => {
        setValue((prev) => {
            if (prev + n >= 1) {
                return prev + n;
            }
            return 0;
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        if (isNaN(value)) {
            setValue(0);
        }

        setValue(value);
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        if (isNaN(value) || value == 0) {
            setValue(1);
        }
        setFocusing(false);
    };

    const handleKeyboardEvent = (e: KeyboardEvent) => {
        if (e.target !== inputRef.current) return;

        switch (e.code) {
            case "ArrowUp":
                console.log("arrowup");
                changeValByStep(1);
                break;
            case "ArrowDown":
                changeValByStep(-1);
                break;
        }
    };

    useEffect(() => {
        if (!focusing) return;

        inputRef.current?.addEventListener("keydown", handleKeyboardEvent);
        return () => {
            inputRef.current?.removeEventListener(
                "keydown",
                handleKeyboardEvent
            );
        };
    }, [focusing]);

    return (
        <div className={styles.container}>
            <input
                type="text"
                ref={inputRef}
                value={value}
                onChange={handleChange}
                onFocus={() => setFocusing(true)}
                onBlur={handleBlur}
            />
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    changeValByStep(1);
                }}
                className={`${styles.button} ${styles["increase-btn"]}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="7">
                    <path
                        fill="none"
                        stroke="#1E213F"
                        stroke-opacity=".25"
                        stroke-width="2"
                        d="M1 6l6-4 6 4"
                    />
                </svg>
            </div>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    changeValByStep(-1);
                }}
                className={`${styles.button} ${styles["decrease-btn"]}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="7">
                    <path
                        fill="none"
                        stroke="#1E213F"
                        stroke-opacity=".25"
                        stroke-width="2"
                        d="M1 1l6 4 6-4"
                    />
                </svg>
            </div>
        </div>
    );
}
