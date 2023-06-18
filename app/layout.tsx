import "./globals.css";
import { Inter } from "next/font/google";

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
