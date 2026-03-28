import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "../globals.css";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
      <>
        <div className="min-h-screen bg-[#080810] text-white flex">
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0C0C18] border-r border-white/[0.06] flex-col items-center justify-center p-12">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-violet-600/10 blur-[96px] pointer-events-none" />
            <div className="absolute bottom-1/3 left-1/4 w-[280px] h-[280px] rounded-full bg-indigo-600/8 blur-[80px] pointer-events-none" />

            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 max-w-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-violet-500/30">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  width="28"
                  height="28"
                  className="text-white"
                >
                  <path
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Mini CRM
                </h2>
                <p className="text-sm text-white/40 leading-relaxed">
                  Your all-in-one platform for managing customers, orders, and
                  products — beautifully.
                </p>
              </div>

            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/6 blur-[100px] pointer-events-none" />
            <div className="relative z-10 w-full max-w-md">{children}</div>
          </div>
        </div>
        <Toaster position="top-right" />
      </>
  );
}
