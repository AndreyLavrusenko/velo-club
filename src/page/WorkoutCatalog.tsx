import React, {useEffect, useState} from "react";
import {clubAPI, workoutAPI} from "../api/api";
import {WorkoutCatalogs} from "../types/workout";
import {Preloader} from "../common/Preloader";
import {NavLink, useNavigate} from "react-router-dom";
import {Modal} from "../ui/Modal";

import "../style/layout/catalog.scss";
import "../style/components/modal.scss";
import {WorkoutItem} from "../ui/WorkoutItem";
import {Popover} from "../ui/Popover";
import {useAppSelector} from "../hook/redux";

export const WorkoutCatalog = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [allWorkouts, setAllWorkouts] = useState<WorkoutCatalogs[]>([]);
    const [allClubWorkouts, setAllClubWorkouts] = useState<WorkoutCatalogs[]>([]);

    const [loading, setLoading] = useState(true);

    const [workoutActive, setWorkoutActive] = useState("");

    const [activeSection, setActiveSection] = useState("personal");


    const navigation = useNavigate();

    // Обновляет клубные тренировки
    useEffect(() => {
        const intervalCall = setInterval(() => {
            getAllAvailableWorkout();
        }, 5000);
        return () => {
            clearInterval(intervalCall);
        };
    }, []);


    useEffect(() => {
        const getAllWorkouts = async () => {
            const res = await workoutAPI.getAllWorkouts();

            if (res) {
                if (res.resultCode === 0) {
                    setAllWorkouts(res.result);
                }
            }

        };

        const getActiveWorkout = async () => {
            const res = await workoutAPI.getActiveWorkout();

            if (res) {
                if (res.resultCode === 0) {
                    setWorkoutActive(res.current_workout);
                }
            }
        };

        getAllWorkouts();
        getActiveWorkout();
        getAllAvailableWorkout();

        const res = localStorage.getItem("5593f802");
        if (res) {
            if (res === "0") {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        } else {
            setIsAdmin(false);
        }

        setLoading(false);
    }, [loading, activeSection]);

    const getAllAvailableWorkout = async () => {
        const res = await clubAPI.getVeloClubWorkout();

        if (res) {
            if (res.resultCode === 0) {
                setAllClubWorkouts(res.result);
            }
        }
    };

    const setActiveWorkout = async (id: string) => {

        if (id) {
            const res = await workoutAPI.setActiveWorkout(id);

            if (res) {
                if (res.resultCode === 0) {
                    navigation("/");
                }
            }
        }
    };

    const deleteSelectedWorkout = async (workout_id: string) => {
        if (workout_id) {
            const res = await workoutAPI.deleteWorkout(workout_id)

            if (res) {
                if (res.resultCode === 0) {
                    const workoutWithoutDelete = allWorkouts.filter(item => item.id !== workout_id)
                    setAllWorkouts(workoutWithoutDelete)
                }
            }
        }
    }

    const setSectionActive = (section: string) => {
        setActiveSection(section);
    };


    return (
        <>
            {
                loading
                    ? <Preloader/>
                    : <>
                        <div className="catalog">
                            <h2 className="login__title">Тренировки</h2>

                            {
                                isAdmin ? null
                                    : <div className="catalog__button">
                                        <div
                                            onClick={() => setSectionActive("personal")}
                                            className={`catalog__button-item 
									${activeSection === "personal" ? "active" : null}`}
                                        >
                                            Личные
                                        </div>
                                        <div
                                            onClick={() => setSectionActive("club")}
                                            className={`catalog__button-item 
									${activeSection === "club" ? "active" : null}`}
                                        >
                                            Клубные
                                        </div>
                                    </div>
                            }

                            <div className="catalog__items">
                                {
                                    activeSection === "personal"
                                        ?
                                        allWorkouts.map((item: WorkoutCatalogs) => (
                                            <WorkoutItem workoutActive={workoutActive} key={item.id} isMyWorkout={true}
                                                         setActiveWorkout={setActiveWorkout} item={item} deleteSelectedWorkout={deleteSelectedWorkout}/>
                                        ))
                                        :
                                        allClubWorkouts.map((item: WorkoutCatalogs) => (
                                            <WorkoutItem workoutActive={workoutActive} key={item.id} isMyWorkout={false}
                                                         setActiveWorkout={setActiveWorkout} item={item} deleteSelectedWorkout={deleteSelectedWorkout}/>
                                        ))

                                }


                            </div>

                        </div>


                    </>
            }
        </>
    );
};