import { useEffect, useRef, useState } from "react"
import LeaderBoardToggle from "./LeaderBoardToggle"
import { NewBestTime } from "./NewBestTime"
import { ENDPOINTS } from "../config"
import { Digits } from "./Digits"

const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(""));

export function SudokuGrid() {
  const [grid, setGrid] = useState(emptyGrid)
  const [solution, setSolution] = useState(emptyGrid)
  const [fixedGrid, setFixedGrid] = useState(emptyGrid)
  const [focusCell, setFocusCell] = useState(null)
  const [lives, setLives] = useState(3)
  const [message, setMessage] = useState("")
  const [level, setLevel] = useState("medium")
  const [bestTime, setBestTime] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [time, setTime] = useState(0)
  const [leaderBoard, setLeaderBoard] = useState([])
  const [leaderBoardByLevel, setLeaderBoardByLevel] = useState("medium")
  const [draftMode, setDraftMode] = useState(false)
  const [draftNumbers, setDraftNumbers] = useState({})

  const isSolved = (grid, solution) => {
    for(let i = 0 ; i < 9 ; i++) {
      for(let j = 0 ; j < 9 ; j++) {
        if(grid[i][j] !== solution[i][j]) {
          return false
        }
      }
    }
    return true 
  }

  const timerRef = useRef(null)

  useEffect(() => {
    if(solution[0][0] === "") return
    if(isSolved(grid, solution)){
      setIsComplete(true)
      setMessage("Félicitations, vous avez réussi ! 🎉")
    }
  }, [grid, solution])

  const handleChange = (row, col, val) => {
    if(isComplete || lives === 0 || fixedGrid[row][col]) return
    const digit = val !== "" ? val[val.length-1] : ""
    const isError = digit && digit !== solution[row][col]
    if(draftMode && /^[1-9]$/.test(digit)){
      const key = `r${row}c${col}`
      setDraftNumbers( prev => {
        if(prev[key]?.includes(digit)){ 
          return {
            ...prev,
            [key] : prev[key].split('').filter(x => x!== digit).join('')
          }
        }
        return {
          ...prev,
            [key] : (prev[key] ? prev[key] + digit : digit)
        }
      }) 
      return
    }
    if(isError) setLives(l => l - 1)
    if (digit === "" || /^[1-9]$/.test(digit)) {
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = digit;
      setGrid(newGrid)
      setDraftNumbers(prev => {
        const copy = {...prev}
        delete copy[`r${row}c${col}`]
        return copy
      })
    }
  }

  const handleKeyDown = (e, i, j) =>{
    if(e.key === "Backspace" || e.key === "Delete"){
      e.preventDefault()
      handleChange(i, j, "")
    } else if(/^[1-9]$/.test(e.key)){
      e.preventDefault()
      handleChange(i, j, e.key)
    }
  }

  useEffect(() =>{
    const fetchSudoku = async () =>{
      try{
        const response = await fetch(ENDPOINTS.sudoku(level))  
        const data = await response.json()
        const formatedGrid = data.puzzle.map(row => row.map(cell => cell === "0" ? "" : cell))
        setGrid(formatedGrid)
        setSolution(data.solution)
        setFixedGrid(formatedGrid.map(row => row.map(cell => cell !== "")))
        // reset
        setTime(0)
        setLives(3)
        setMessage("")
        setIsComplete(false)
        setTime(0)
        if(timerRef.current){
          clearInterval(timerRef.current)
        }
        timerRef.current = setInterval(() => {
          setTime(prev => prev + 1)
        }, 1000)
        // get best time
        const fetchBestTime = await fetch(ENDPOINTS.leaderboard(level))
        const dataBestTime = await fetchBestTime.json()
        setBestTime(dataBestTime)
      }catch(err){
        console.log({err : err.message})
      }
    }
    fetchSudoku()
  }, [level]) 

  useEffect(() => {
    if(lives <3){
      setMessage(`Il vous reste ${lives} vie${lives > 1 ? "s" : ""}.`)
      if(lives >0){
        const timer = setTimeout(() => {
          setMessage("")
        }, 2000)
        return () => clearTimeout(timer)
      } else {
        setMessage("Vous avez perdu 💀")
      }
    }
  }, [lives])

  useEffect(() => {
    if(isComplete || lives === 0){
      clearInterval(timerRef.current)
    }
  }, [isComplete, lives])

  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try{
        const response = await fetch(ENDPOINTS.leaderboard(leaderBoardByLevel))
        const data = await response.json()
        setLeaderBoard(data)
      } catch(err) {
        console.log("erreur message :", err.message)
      }
    }
    fetchLeaderBoard()
    }, [leaderBoardByLevel])

  return (
    <>
    <div className="flex flex-col sm:flex-row justify-between items-start absolute top-0 left-0 w-full p-4">
      <div className="flex gap-2">
        <p className="text-2xl">Difficulty :</p>
        {["easy", "medium", "hard"].map(lvl => (
        <button
          key={lvl}
          onClick={() => setLevel(lvl)}
          className={`px-3 py-1 rounded transition focus:outline-none focus:ring-0 ${level === lvl ? " text-white/60 bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}
        >
          {lvl}
        </button>
        ))}
      </div>

      <div className="text-2xl mr-4">
        ⏱️ {`${Math.floor(time/60).toString().padStart(2, "0")} : ${(time % 60).toString().padStart(2, "0")}`}
      </div>
    </div>

    <div className="flex justify-center gap-2 mt-4">
      {[...Array(3)].map((_, i) => (
        <span key={i}>
          {i < lives ? "❤️" : "🤍"}
        </span>
      ))}
    </div>

    <p className={`mt-3 min-h-[1.5rem] transition-opacity duration-500 ${isComplete ? "text-green-500" : "text-red-500"} ${message ? "opacity-100" : "opacity-0"}`}>{message}</p>

    <div className="grid grid-cols-9 mx-auto mt-5 w-fit bg-color-grid">
      {grid.map((row, i) =>
        row.map((cell, j) => {
          const isError = cell !== '' && cell !== solution[i][j]
          const isFixed = fixedGrid[i][j]
          const border = `
            border-white/20
            ${i % 3 === 0 ? "border-t-4" : "border-t"}
            ${j % 3 === 0 ? "border-l-4" : "border-l"}
            ${i === 8 ? "border-b-4" : "border-b"}
            ${j === 8 ? "border-r-4" : "border-r"}
          `
          return draftNumbers[`r${i}c${j}`] ? (
            <div className="relative w-10 h-10 ">
              {/* Input invisible pour capter la saisie */}
              <input
                key={`${i}-${j}`}
                value={cell}
                onFocus={() => setFocusCell([i, j])}
                onKeyDown={(e) => handleKeyDown(e, i, j)}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
              />
              {/* Affichage des brouillons comme une grille */}
              <div
                className={`grid grid-cols-3 gap-[1px] w-full h-full text-xs text-red-50 text-center ${border} ${focusCell && focusCell[0] === i && focusCell[1] === j ? "bg-blue-400/40" : ""} ${isFixed ? "text-sky-400" : "text-white"} ${isError ? "bg-red-600" : ""}`}
              >
                {Array.from({ length: 9 }).map((_, k) => {
                  const digit = (draftNumbers[`r${i}c${j}`] || "").includes(String(k + 1)) ? k + 1 : ""
                  return (
                    <span key={k} className="flex items-center justify-center text-[0.55rem] text-gray-50 text-white/60 font-serif">
                      {digit}
                    </span>
                  )
                })}
              </div>
            </div>
          ) : (
            <input
              key={`${i}-${j}`}
              value={cell}
              onFocus={() => setFocusCell([i,j])}
              onKeyDown={(e) => handleKeyDown(e, i, j) }
              className={`w-10 h-10 ${border} text-center focus: outline-none ${focusCell && focusCell[0] === i && focusCell[1] === j ? "bg-blue-400/40" : ''} cursor-pointer carret text-2xl ${isFixed ? "text-sky-400" : "text-white"} ${isError ? "bg-red-600" : ""}`}
            />
          )
        })
      )}
    </div>
      
    <Digits
    handleChange = {handleChange}
    focusCell = {focusCell}
    setDraftMode = {setDraftMode}
    draftMode = {draftMode}
    />

    <LeaderBoardToggle
    leaderBoard = {leaderBoard}
    leaderBoardByLevel={leaderBoardByLevel}
    setLeaderBoardByLevel={setLeaderBoardByLevel}/>

    <NewBestTime
    bestTime = {bestTime} 
    isComplete = {isComplete}
    time = {time}
    level={level}/>
    </>
  )
}
