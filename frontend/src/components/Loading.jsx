

export const Loading = () => {

  return (
    <div className="fixed inset-0 bg-gray-800/60 flex items-center justify-center z-50">
      <span className="text-white text-xl font-semibold">
        Loading
        <span className="ml-1 inline-block w-4 text-left animate-dots" />
      </span>
    </div>
  )
}