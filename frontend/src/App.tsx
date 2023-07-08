/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react"
import "./App.css"

function App() {
    const [user, setUser] = useState("")
    const [data, setData] = useState("")

    const getUser = async (username: string) => {
        const data = await fetch(`http://localhost:8000/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        })
        const user = await data.text()
        setUser(user)
    }

    const getAdminData = async () => {
        const data = await fetch("http://localhost:8000/admin", {
            method: "GET",
            credentials: "include",
        })
        const adminData = await data.text()
        setData(adminData)
    }

    const logout = async () => {
        const data = await fetch("http://localhost:8000/logout", {
            method: "POST",
            credentials: "include",
        })
        const user = await data.text()
        setUser(user)
    }

    return (
        <div>
            <h1>Auth</h1>
            <h2>Authentication</h2>

            <button onClick={() => getUser("VArtz")}>Log in as VArtz</button>
            <button onClick={() => getUser("John")}>Log in as John</button>
            <button onClick={() => getUser("Kyle")}>Log in as Kyle</button>

            {user && user !== "Logged out" && user != "Unauthorized" && (
                <button onClick={logout}>Log out</button>
            )}

            <h3>{user}</h3>

            <h2>Authorization</h2>

            <button onClick={getAdminData}>Get admin data</button>

            <h3>{data}</h3>
        </div>
    )
}

export default App
