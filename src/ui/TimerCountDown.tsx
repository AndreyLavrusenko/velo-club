import {convertFromMsToSeconds, formatTime} from "../helpers/getDate";
import {useEffect, useRef} from "react";
import beep from '../assets/notification.mp3'
import "../style/components/ui-element.scss";

type IProps = {
    timer: number
}

export const TimerCountDown = ({timer}: IProps) => {
    const ref = useRef<SVGPathElement>(null);
    const circle = useRef<SVGCircleElement>(null);
    const timerRef = useRef<HTMLSpanElement>(null);
    const stageRef = useRef<HTMLSpanElement>(null);

    const audioPlayer = useRef<HTMLAudioElement>(null);


    useEffect(() => {
        if (convertFromMsToSeconds(timer) > 20){
            if (ref.current) {
                ref.current.style.color = "#43CC7B"
                ref.current.style.animation = 'none';
            }
        }

        if (convertFromMsToSeconds(timer) <= 20) {
            // Переход на след этап
            if (ref.current) {
                ref.current.style.color = "#FF7B3E"
                ref.current.style.animation = 'none';
            }
        }

        if (convertFromMsToSeconds(timer) <= 10) {
            // Переход на след этап
            if (ref.current) {
                ref.current.style.animation = 'blinking 1s infinite';
            }
        }

        if (convertFromMsToSeconds(timer) <= 6) {
            if (audioPlayer.current) {
                try {
                    audioPlayer.current.play();
                } catch (err) {
                    console.log('error with sound')
                }
            }
        }
    }, [timer]);

    return (
        <>
            <div className="base-timer">
                <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g className="base-timer__circle">
                        <circle ref={circle} className="base-timer__path-elapsed" cx="50" cy="50" r="45"/>
                        <path
                            id="base-timer-path-remaining"
                            style={{strokeDasharray: 283 + " " + 283}}
                            ref={ref}
                            className="base-timer__path-remaining green"
                            d="
                              M 50, 50
                              m -45, 0
                              a 45,45 0 1,0 90,0
                              a 45,45 0 1,0 -90,0
                            "
                        ></path>
                    </g>
                </svg>
                <span id="base-timer-label" className="base-timer__label" ref={timerRef}>{formatTime(timer)}</span>
                <span className="base-timer__label-subtitle" ref={stageRef}>Время этапа</span>
            </div>
            <audio ref={audioPlayer} src={beep} />
        </>
    );
};