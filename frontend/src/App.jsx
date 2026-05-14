import { useEffect } from "react"
import { useSelector } from "react-redux"
import Home from "./pages/Home"

function App() {
    const isDarkMode = useSelector((state) => state.lead.isDarkMode)

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [isDarkMode])

    return <Home />
}

export default App