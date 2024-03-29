import "../style/components/current_stage.scss";
import {CurrentStageItem} from "../ui/CurrentStageItem";
import {TimerCountDown} from "../ui/TimerCountDown";
import {StatusItem} from "../ui/StatusItem";
import {CONDITION_TYPE, STATUS_ITEM} from "../helpers/const";
import {WorkoutType} from "../types/workout";
import React, {memo, useEffect, useRef, useState} from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import {convertFromMsToSeconds} from "../helpers/getDate";
import comment from "../assets/images/comment.svg";
import preloader from "../assets/images/preloader.svg";
import Chart from "react-apexcharts";
import {ProgressBar as ProgressCustomBar} from "../ui/ProgressBar";


type IProps = {
	activeWorkout: WorkoutType,
	allStagesCount: number,
	timeStagePast: number,
	goToTheNextStage: (current_stage: number) => {},
	pulse: string[],
	time: number[],
	timeAllStagesFormated: string,
	timeSpendAtThisMoment: number,
	timeAllStages: number
}

export const CurrentStage = memo(({activeWorkout, allStagesCount, timeStagePast, goToTheNextStage, pulse, time, timeAllStagesFormated, timeSpendAtThisMoment, timeAllStages}: IProps) => {
	const [timer, setTimer] = useState(timeStagePast);
	const [isTimerCorrectAfterReload, setIsTimerCorrectAfterReload] = useState(false);
	const timerId = useRef();
	const [options, setOptions] = useState({
		chart: {
			id: "basic-bar",
			type: 'area'
		},
		dataLabels: {
			enabled: false
		},
		xaxis: {
			categories: time,
			type: 'datetime',
			labels: {
				format: 'm:ss',
			}
		},
		tooltip: {
			shared: false,
			intersect: true,
			x: {
				show: false
			}
		},
		stroke: {
			curve: "stepline",
			width: 1
		},
		fill: {
			type:"solid",
			opacity: [0.35, 1],
		},
	});
	const [series, setSeries] = useState([
		{
			type: "area",
			name: "area-1",
			data: pulse as unknown as ApexAxisChartSeries | ApexNonAxisChartSeries | undefined
		},
	]);


	useEffect(() => {
		(timerId.current as any) = setInterval(() => {
			setTimer(prev => prev - 1000);
			setTimeout(() => {
				setIsTimerCorrectAfterReload(true);
			}, 1000);
		}, 1000);

		return () => clearInterval(timerId.current);

	}, [timer]);

	useEffect(() => {
		if (timeStagePast !== 0) {
			setTimer(timeStagePast);
		}
	}, [timeStagePast]);

	useEffect(() => {
		if (convertFromMsToSeconds(timer) <= 0) {
			// Переход на след этап
			goToTheNextStage(activeWorkout.id);
			clearInterval(timerId.current);
		}
	}, [timer]);


	const currentStage = activeWorkout.id;

	// @ts-ignore
	const condition = CONDITION_TYPE[activeWorkout.condition];


	return (
		<div className="current-stage">
			<div className="current-stage__header">
				<div className="current-stage__header--stage--count">
					<CurrentStageItem current_stage={currentStage.toString()} type={""} />
				</div>
				<div className="current-stage__header--stage--stat">
					<div className="current-stage__header--all">
						Время: {timeAllStagesFormated}
					</div>

					<div className="current-stage__header--all current-stage__header--divider" style={{marginLeft: '12px'}}>
						Этап: {currentStage.toString()} / {allStagesCount}
					</div>
					{
						activeWorkout.pulse_2
							? <ProgressCustomBar max={10} current={activeWorkout.pulse_2} type={"pulse"} />
							: null
					}
				</div>
			</div>
			<div className="current-stage__content">
				<div className="current-stage__content--wrapper">
					{
						isTimerCorrectAfterReload
							? <TimerCountDown timer={timer} />
							: <img src={preloader} alt=""/>
					}

					{/* Не показывать ничего если это разминка или отдых */}
					{
						!activeWorkout.isWarmUp && !activeWorkout.isRecovery
							? <div className="current-stage__content--items">
								<StatusItem type={STATUS_ITEM.pulse} data={[activeWorkout.pulse_1, activeWorkout.pulse_2]} />
								<StatusItem type={STATUS_ITEM.turns} data={[activeWorkout.turns_1, activeWorkout.turns_2]} />
								<StatusItem type={STATUS_ITEM.condition} data={condition} />
							</div>
							: null
					}

					{/* Показывать если разминка или отдых */}
					{
						activeWorkout.isWarmUp || activeWorkout.isRecovery
							? <div className="current-stage__content--items">
								<div
									className="current-stage__header--stage--title current-stage__header--stage--title-rest"
								>
									{/*style={activeWorkout.isRecovery ? {color: '#43CC7B'} : {color: '#1CC3E6'}}*/}
									{activeWorkout.isRecovery ? "Отдых" : "Разминка"}
								</div>
							</div>
							: null
					}

				</div>
				<div className="current-stage__chart">
					{/*@ts-ignore*/}
					<Chart
						options={options}
						series={series}
						height={245}
						type="line"
					/>

					<ProgressBar
						className="progressBar"
						customLabel={(((timeSpendAtThisMoment / timeAllStages) * 100)).toFixed(0) + "%"}
						completed={timeSpendAtThisMoment}
						maxCompleted={timeAllStages}
						baseBgColor={"#FFEEE7"}
						bgColor={"#FF7B3E"}
					/>
				</div>
			</div>

			{
				activeWorkout.comment
					? <div className="current-stage__comment">
						<div className="status-item--title current-stage__comment--text">
							<img src={comment} alt=""/>
							{activeWorkout.comment}
						</div>
					</div>
					: null
			}
		</div>
	);
});