import Link from "next/link";

export default function Home() {
  return (
    <main className="grid w-full mx-auto min-h-[80vh]">
      <div className="flex gap-8 flex-col items-center justify-center">
        <h1 className="lg:pt-28 text-5xl md:text-6xl lg:text-8xl font-semibold text-center max-w-[18ch]">
          Never Fail Another Interview Again
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl max-w-[28ch] text-center text-gray-600">
          Practice with our AI interviewers, get feedback and excel
        </p>
        <div
          className="button block"
          data-btn-intent="primary"
          data-btn-size="large"
        >
          <Link href="/interview" className="text-xl">
            Interview Now
          </Link>
        </div>

        <div className="w-full max-w-[1200px] aspect-video bg-gray-200 rounded-xl"></div>
      </div>
    </main>
  );
}
