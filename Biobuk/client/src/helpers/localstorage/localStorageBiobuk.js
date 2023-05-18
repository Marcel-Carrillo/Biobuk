export const saveLocalStorageBiobuk = (item) => {
    window.localStorage.setItem("token", item)
    return true
}

export const getLocalStorageBiobuk = () => {
    const token = localStorage.getItem("token")
    return token
}

export const deleteLocalStorageBiobuk = () => {
    localStorage.removeItem("token")
    return true;
}