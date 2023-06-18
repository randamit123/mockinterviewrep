"use client";

import { ChangeEvent, useState } from "react";

import Image from "next/image"
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

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
          <input
            type='text'
            placeholder='Your first name'
            className='h-16 w-full outline outline-1 outline-black outline-offset-0 p-5'
            onChange={onNameChange}
          />
          <select className='h-16 w-full outline outline-1 outline-black outline-offset-0 mt-8 p-5'>
            <option value="javascript">SWE Interview</option>
            <option value="php" disabled>PM Interview (coming soon)</option>
            <option value="java" disabled>Consulting Interview (coming soon)</option>
            <option value="golang" disabled>Banking interview (coming soon)</option>
          </select>
          <Link
            className={`
              w-full mt-8 bg-gray-400 text-white text-3xl p-4 block
              text-center ${name !== "" ? "" : "pointer-events-none"}
            `}
            href={`/interview?name=${name}`}
          >
            Get started!
          </Link>
        </div>
      </div>
    </div>
  )
}
