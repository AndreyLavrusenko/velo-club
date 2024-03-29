import "../style/components/ui-element.scss";
import {memo, useEffect, useState} from "react";
import {millisToMinutesAndSeconds} from "../helpers/getDate";

import pulse from "../assets/images/heart.svg";
import turns from "../assets/images/speedometer.svg";
import condition from "../assets/images/candle.svg";
import timer_start from "../assets/images/timer-start.svg";

type IProps = {
	type: string,
	data?: number | string | Array<string | number| undefined>,
}

export const StatusItem = memo(({type, data}: IProps) => {
	const [color, setColor] = useState("");
	const [title, setTitle] = useState("");
	const [icon, setIcon] = useState("");
	const [time, setTime] = useState("");

	useEffect(() => {
		switch (type) {
			case "Пульс":
				setColor("#FFE5E9");
				setTitle("Пульс");
				setIcon(pulse);
				break;

			case "Обороты":
				setColor("#EBE8FB");
				setTitle("Обороты");
				setIcon(turns);
				break;

			case "Условие":
				setColor("#EFF9FF");
				setTitle("Условие");
				setIcon(condition);
				break;

			case "Время":
				setColor("#EAF9F0");
				setTitle("Время");
				setIcon(timer_start);
				if (data != null) {
					// @ts-ignore
					setTime(millisToMinutesAndSeconds(data[0]))
				}
				break;
		}
	}, []);


	const first = Array.isArray(data) ? data[0] ? data[0] : "" : "";
	const second = Array.isArray(data) ? data[1] ? data[1] : "" : "";

	let result = ""
	if (first && second) {
		result += first + ' - ' + second
	} else if (first && !second) {
		result += first
	} else if (!first && second) {
		result += second
	} else {
		result = data as string
	}

	return (
		<div className="status-item">
			<div className="status-item--header">
				<div className="status-item__round" style={{backgroundColor: color}}>
					<img src={icon} alt=""/>
				</div>
				<div className={data ? "status-item--title" : "status-item--subtitle"}>{title}</div>
			</div>
			<div className="status-item--main">
				{data && <div className="status-item--subtitle">{time ? time : result}</div>}
			</div>
		</div>
	);
});