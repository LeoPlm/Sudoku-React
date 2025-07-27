import { useEffect } from "react"


export const Loading = ({setLoading, grid}) => {
  
  const isGrid = (tryGrid) => {
    for(let i = 0 ; i<tryGrid.length ; i++){
      for(let j = 0 ; j<tryGrid[0].length ; j++){
        if(tryGrid[i][j] !== ""){
          return true
        }
      }
    }
    return false
  }

  useEffect(() => {
    if(!isGrid(grid)){
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [grid])

  return (
    <div className="fixed inset-0 bg-gray-800/60 flex items-center justify-center z-50">
      <span className="text-white text-xl font-semibold">
        Loading
        <span className="ml-1 inline-block w-4 text-left animate-dots" />
      </span>
    </div>
  )
}