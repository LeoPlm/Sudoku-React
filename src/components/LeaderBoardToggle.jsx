import { useState } from "react"

export default function LeaderBoardToggle({leaderBoard, leaderBoardByLevel, setLeaderBoardByLevel }) {

  const [showLeaderBoard, setShowLeaderBoard] = useState(false)

  return (
    <div className="mt-6 flex flex-col items-center text-white">
      <button
        onClick={() => setShowLeaderBoard(!showLeaderBoard)}
        className="mb-3 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
      >
        Leaderboard
      </button>
      {showLeaderBoard && (
        <>
          <div className="bg-gray-800 p-4 rounded">
            <div className={`flex gap-2 mb-3`} >
              {["easy","medium","hard"].map(lvl => (
                <button
                key={lvl}
                onClick={() =>setLeaderBoardByLevel(lvl)}
                className={`px-3 py-1 rounded ${leaderBoardByLevel === lvl ? "bg-gray-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                  {lvl}
                </button>
              ))}
            </div>
            <h2 className="text-center text-lg capitalize mb-2"> Best players :</h2>
            <ul className="text-sm">
              {leaderBoard?.map((elem,i) => (
                <li 
                key={i}
                className="flex justify-between border-b border-white/10 py-1"
                >
                  <span>{i+1} {elem.name}</span> 
                  <span> ({`${Math.floor(elem.time/60)} : ${(elem.time%60).toString().padEnd(2, '0')}`} min) </span> 
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}