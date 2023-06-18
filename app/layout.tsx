import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "InterviewSensei | AI Mock Interviewer",
  description:
    "InterviewSensei helps you prepare for your dream job interview by doing mock interviews with our AI interviewers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <div className="flex flex-col p-4">
          <nav className="">
            <Image
              alt="logo"
              src="/logo.png"
              height={506 * 0.2}
              width={1419 * 0.2}
              priority
            />
          </nav>
          {children}
        </div>
        <footer className="p-12 bg-gray-100 mt-24">
          <p className="text-center font-bold text-black/20">
            Made @ CalHacks 9.0 2023
          </p>
        </footer>
      </body>
    </html>
  );
}
