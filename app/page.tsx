import Link from "next/link";
import { Beaker, ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") redirect("/admin");
  if (session?.user?.role === "SELLER") redirect("/seller");
  if (session?.user?.role === "BUYER") redirect("/buyer");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <Beaker className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-white">AASA MedChem</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2 rounded-full transition-all flex items-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center text-center mt-12 mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-8">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Enterprise Chemical Marketplace
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              The Future of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Medical Chemistry
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
              A comprehensive role-based workflow for chemical products, precise quotations, secure orders, and intelligent inventory tracking.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full font-semibold transition-all hover:shadow-[0_0_40px_8px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                Access Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Inventory</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatic unit conversions across weights, volumes, and counts. Track stock levels with absolute precision.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dynamic Quotations</h3>
              <p className="text-slate-400 leading-relaxed">
                Generate real-time quotes based on base-unit pricing algorithms. Seamless transition from quote to confirmed order.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-slate-400 leading-relaxed">
                Tailored workflows for Admins, Sellers, and Buyers. Secure, isolated environments for every participant.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
