import Image from "next/image"

export default function Home() {
  return (
    <div className='flex flex-col justify-center h-screen'>
      <div className='my-auto'>
        <Image
          className="mx-auto"
          alt="logo"
          src="/logo.svg"
          height={134}
          width={363}
          priority
        />
        <div className='mx-auto mt-8 text-6xl font-bold text-center'>
          Welcome!
        </div>
        <div className='w-80 mx-auto mt-16'>
          <input type='text' placeholder='Your Name' className='h-16 w-full outline outline-1 outline-black outline-offset-0 p-5'/>
          <select className='h-16 w-full outline outline-1 outline-black outline-offset-0 mt-8 p-5'>
            <option value="javascript">SWE Interview</option>
            <option value="php">PM Interview</option>
            <option value="java">Consulting Interview</option>
            <option value="golang">Banking interview</option>
          </select>
          <button className='h-16 w-full mt-8 bg-gray-400 text-white text-3xl'>Start</button>
        </div>
      </div>
    </div>
  )
}
