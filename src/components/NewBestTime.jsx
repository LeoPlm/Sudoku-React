import { useEffect, useState } from "react"


export const NewBestTime = ({isComplete, bestTime, time, level}) => {

  const [playerName, setplayerName] = useState("")
  const [showPopUp, setShowPopUp] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const response = await fetch(`http://localhost:3000/api/leaderboard?`, {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({name : playerName, time, level})
      })
      await response.json()
      setShowPopUp(false)
    } catch(err) {
      console.error('erreur', err.message)
    }
  }

  useEffect(() => {
    if(isComplete && (bestTime?.length < 5 || time < bestTime?.[4].time)){
      setShowPopUp(true)
    }
  }, [isComplete])

  return (
    <>
    {showPopUp && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-sky-600 p-6 rounded text-center shadow-lg max-w-sm mx-2">
          <h2 className="text-xl font-bold mb-2">🎉 Nouveau meilleur temps ! 🎉</h2>
          <p className="font-bold mb-2">{`${Math.floor(time/60)} : ${(time%60).toString().padEnd(2, '0')}`}</p>
          <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col">
            <input type = "text" 
            placeholder = "Your name"
            value= {playerName}
            onChange={(e) => setplayerName(e.target.value)}
            className="p-2 border rounded"
            maxLength={20}
            />
            <input type="submit" value={"Envoyer"}
            className="mt-3 px-4 py-2 bg-white text-sky-600 rounded hover:bg-gray-200 w-1/2 mx-auto cursor-pointer"
            />
          </form>
        </div>
      </div>
    )}
    </>
  )
}