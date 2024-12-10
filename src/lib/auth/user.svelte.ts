import { getContext, setContext } from "svelte"

export class User {
    data = $state({
        lockedIn: false,
        refreshToken: "",
        accessToken: ""
    })
}

const USER_KEY = Symbol("USER");

export function setUserStateContext () {
    console.log("Setting user state in context");
    setContext(USER_KEY, new User());
}

export function getUserStateContext () {
    getContext(USER_KEY);
}