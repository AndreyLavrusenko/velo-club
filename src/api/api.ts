import axios from "axios";
import {Workout, WorkoutType} from "../types/workout";

const instance = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': "application/json"
    },
    baseURL: process.env.REACT_APP_BACK_URL,
})

const token = localStorage.getItem("token")
const admin = localStorage.getItem("5593f802")

export const authAPI = {
    login: async (login: string, password: string) => {
        try {
            const {data} = await instance.post(`auth/trainer-login`, {login, password})
            return data
        } catch (err) {
            console.log(err)
        }
    },


    register: async (login: string, password: string) => {
        try {
            const {data} = await instance.post('auth/trainer-reg', {login, password})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getProfileInfo: async () => {
        try {
            const {data} = await instance.get('auth/get-user-info', {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    changeUsername: async (login: string) => {
        try {
            const {data} = await instance.put('auth/change-username', {login}, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    changePassword: async (password: string) => {
        try {
            const {data} = await instance.put('auth/change-password', {password}, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    changePasswordUsingLogin: async (login: string, new_password: string) => {
        try {
             const {data} = await instance.put('auth/change-password-using-login', {login, new_password})
            return data
        } catch (err) {
            console.log(err)
        }
    }
}


export const workoutAPI = {
    getWorkout: async (workout_id: string) => {
        try {
            const {data} = await instance.get(`workout/get-workout?workout_id=${workout_id}`)
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getWorkoutInterval: async (workout_id: string) => {
        try {
            const {data} = await instance.get(`workout/get-workout-info?workout_id=${workout_id}`)
            return data
        } catch (err) {
            console.log(err)
        }
    },

    startWorkout: async (workout_id: string) => {
        try {
            return await instance.put(`workout/start-workout?workout_id=${workout_id}`, {})
        } catch (err) {
            console.log(err)
        }
    },

    resetWorkout: async (workout_id: string) =>  {
        try {
            return await instance.put(`workout/reset-workout?workout_id=${workout_id}`, {})
        } catch (err) {
            console.log(err)
        }
    },

    goToTheNextStage: async (workout_id: string, current_stage: number) =>  {
        try {
            return await instance.put(`workout/go-next-stage?workout_id=${workout_id}`, {current_stage})
        } catch (err) {
            console.log(err)
        }
    },

    getTimeStart: async (workout_id: string) => {
        try {
            const {data} = await instance.get(`workout/get-start-time?workout_id=${workout_id}`)
            return data
        } catch (err) {
            console.log(err)
        }
    },

    updateWorkout: async (workout: WorkoutType[], workout_id: string) => {
        try {
            return await instance.put(`workout/update-workout?workout_id=${workout_id}`, {workout})
        } catch (err) {
            console.log(err)
        }
    },

    getUpdatedWorkout: async (workout_id: string) => {
        try {
            const {data} = await instance.get(`workout/get-update-workout?workout_id=${workout_id}`)
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getAllWorkouts: async () => {
        try {
             const {data} = await instance.get('workout/get-all-user-workout', {headers: {token}})
            return data
        } catch(err) {
            console.log(err)
        }
    },

    createNewWorkout: async (workout_name: string) => {
        try {
            const {data} = await instance.post('workout/create-workout', {workout_name}, {headers: {token, admin}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    setActiveWorkout: async (workout_id: string) => {
        try {
            const {data} = await instance.post('workout/set-active-workout', {workout_id}, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getActiveWorkout: async () => {
        try {
            const {data} = await instance.get('workout/get-active-workout', {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    checkWhoseWorkout: async (workout_id: string) => {
        try {
            const {data} = await instance.get(`workout/check-who-owns-workout?workout_id=${workout_id}`, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    deleteWorkout: async (workout_id: string) => {
        try {
            const {data} = await instance.delete(`workout/delete-workout?workout_id=${workout_id}`, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    }
}


export const clubAPI = {

    createClub: async (club_name: string, privacy: boolean) => {
        try {
            const {data} = await instance.post('club/create-club', {club_name, privacy}, {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },


    getMyClub: async () => {
        try {
            const {data} = await instance.get('club/get-created-by-user-club', {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getAllClubs: async () => {
        try {
            const {data} = await instance.get('club/get-all-clubs', {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    getAvailableClubWorkout: async () => {
        try {
            const {data} = await instance.get('club/get-workout-club', {headers: {token}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    searchClub: async (search_name: string) => {
        try {
            const {data} = await instance.get('club/find-club', {headers: {token, search_name}})
            return data
        } catch (err) {
            console.log(err)
        }
    },

    joinToTheClub: async (club_id: string) => {
        try {

            const {data} = await instance.put('club/join-to-the-club', {club_id}, {headers: {token}})
            return data

        } catch (err) {
            console.log(err)
        }
    },

    getAllMyClubs: async () => {
        try {

            const {data} = await instance.get('club/get-all-my-clubs', {headers: {token}})
            return data

        } catch (err) {
            console.log(err)
        }
    },

    getVeloClubWorkout: async () => {
        try {
            const {data} = await instance.get('club/get-veloclub-workout', {headers: {token}})
            return data

        } catch (err) {
            console.log(err)
        }
    }

}