export default function AmbientBlobs() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden"
    >
      <div className="absolute w-[700px] h-[700px] rounded-full blur-[100px] bg-[rgba(var(--primary-rgb),0.06)] -top-[20%] -left-[15%] animate-[blobDrift_25s_ease-in-out_infinite]" />
      <div className="absolute w-[550px] h-[550px] rounded-full blur-[100px] bg-[rgba(99,102,241,0.05)] dark:bg-[rgba(99,102,241,0.06)] -bottom-[15%] -right-[10%] animate-[blobDrift_25s_ease-in-out_infinite_-10s]" />
      <div className="absolute w-[450px] h-[450px] rounded-full blur-[100px] bg-[rgba(167,139,250,0.04)] dark:bg-[rgba(167,139,250,0.05)] top-[45%] left-[55%] animate-[blobDrift_25s_ease-in-out_infinite_-18s]" />
    </div>
  )
}
