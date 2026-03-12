import { Header } from "@/components/header"
import { NewsVerificationForm } from "@/components/news-verification-form"
import { Shield, Search, Zap, CheckCircle, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <Header />

      <main className="relative">
        {/* Background Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4 animate-in fade-in slide-in-from-bottom-3">
              <Zap className="w-4 h-4" />
              Next-Generation News Verification
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 leading-tight">
              Truth matters. <br />
              Verify it in seconds.
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Our advanced AI orchestrates real-time web searches and deep semantic analysis to detect fake news, propaganda, and misleading claims.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700">
                View Demo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
            <FeatureCard
              icon={<Search className="w-6 h-6 text-blue-400" />}
              title="Web-Scale Search"
              description="Tavily-powered search scans the entire web for corroborating evidence and sources."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-purple-400" />}
              title="AI Deep Analysis"
              description="Gen AI models analyze tone, context, and logical consistency to provide a verdict."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6 text-emerald-400" />}
              title="Trusted Ratings"
              description="Get a clear credibility score and a detailed report of all suspicious findings."
            />
          </div>

          <div id="verify" className="relative pt-12">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
            <NewsVerificationForm />
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/50 py-12">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2026 AI News Verification. Built for the era of misinformation.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}
