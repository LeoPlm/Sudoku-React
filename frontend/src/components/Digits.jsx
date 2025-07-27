import { PiEraserFill } from "react-icons/pi"

export const Digits = ({handleChange, focusCell, setDraftMode, draftMode, setEraserMode, eraserMode}) => {


  return (
    <div className="flex flex-wrap justify-center items-center gap-3 w-full mx-auto mt-3 mb-10 hover:cursor-pointer">
    {
      Array.from({length : 9}, (_,i) => (
        <div className="bg-sky-600/50 p-2 px-4 text-xl"
        key={i+1}
        onClick={focusCell !== null ? () => {
          handleChange(focusCell[0], focusCell[1], (i+1).toString())}
          : undefined
        }
        >
          {i+1}
        </div>
      ))
    }
    <div 
    className= {`w-12 h-12 bg-sky-600/50 rounded-full flex items-center justify-center pl-1 ${draftMode ? "border-white border-1" : ""}`}
    title="draft/brouillon"
    onClick={() => {
      setDraftMode(!draftMode)
      eraserMode ? setEraserMode(false) : null}}
    >
      📝
    </div>
    <div 
    className= {`w-12 h-12 bg-sky-600/50 rounded-full flex items-center justify-center pl-1 ${eraserMode ? "border-white border-1" : ""}`}
    title="eraser/gomme"
    onClick={() => {
      setEraserMode(!eraserMode)
      draftMode ? setDraftMode(false) : null}}
    >
      <PiEraserFill />
    </div>
    </div>
  )
}