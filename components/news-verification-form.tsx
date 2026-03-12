"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, Loader2, Info, Timer, Zap, Cpu, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CATEGORIES = ["News", "Sports", "Education", "Politics", "Technology", "Health", "Business", "Entertainment"]

export function NewsVerificationForm() {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token")
    setToken(storedToken)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const url = token ? "/api/predict" : "/predict"
      const headers: any = {
        "Content-Type": "application/json",
      }
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      const response = await fetch(`http://localhost:8000${url}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ text, category }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.error || "Failed to analyze news")
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-primary/20 bg-slate-900/50 backdrop-blur-xl text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          {/* <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" /> */}
          AI News Verification
        </CardTitle>
        <CardDescription className="text-slate-400 text-lg">
          Uncover the truth with real-time web search and advanced LLM analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-1.5 transition-all text-sm ${category === cat
                    ? 'bg-blue-600 hover:bg-blue-700 border-transparent shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  onClick={() => setCategory(cat === category ? null : cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>

            <Label htmlFor="news-text" className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Article Text or Headline
            </Label>
            <div className="relative group">
              <Textarea
                id="news-text"
                placeholder="Paste the news content here to verify its authenticity..."
                className="min-h-[180px] bg-slate-800/50 border-slate-700 focus:border-primary/50 text-slate-200 text-lg transition-all duration-300 group-hover:bg-slate-800/80 rounded-xl"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {!text && (
                <div className="absolute right-4 bottom-4 pointer-events-none opacity-20">
                  <Search className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-200 bg-red-900/30 border border-red-500/50 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6 p-6 border border-slate-700/50 rounded-2xl bg-slate-800/30 backdrop-blur-md animate-in zoom-in-95 duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-xl text-slate-300">Verdict:</span>
                  <Badge
                    variant={result.label === "Real" ? "default" : "destructive"}
                    className={`text-xl px-6 py-2 rounded-full font-black uppercase tracking-tighter ${result.label === "Real"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                      : "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                      }`}
                  >
                    {result.label}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {result.ai_meta && (
                    <>
                      <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 flex items-center gap-1.2 py-1">
                        <Cpu className="w-3 h-3" /> {result.ai_meta.model.split('/').pop()}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 flex items-center gap-1.2 py-1">
                        <Timer className="w-3 h-3" /> {result.ai_meta.time_seconds}s
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 flex items-center gap-1.2 py-1">
                        <Zap className="w-3 h-3" /> {result.ai_meta.tokens_total} tokens
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold text-slate-400">
                      <span>Credibility Score</span>
                      <span className="text-primary">{result.credibility_score}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${result.credibility_score > 70 ? 'bg-emerald-500' : result.credibility_score > 40 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        style={{ width: `${result.credibility_score}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 bg-slate-700/20 p-4 rounded-xl border border-slate-700/50">
                    <h4 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                      <Info className="w-4 h-4" /> ANALYSIS SUMMARY
                    </h4>
                    <p className="text-slate-300 leading-relaxed italic">
                      "{result.reason_summary}"
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400">KEY EVIDENCE</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.suspicious_phrases && result.suspicious_phrases.length > 0 ? (
                      result.suspicious_phrases.map((phrase: string, i: number) => (
                        <Badge key={i} variant="outline" className="border-rose-500/30 text-rose-300 bg-rose-500/5">
                          {phrase}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm italic">No specific phrases flagged.</span>
                    )}
                  </div>
                </div>
              </div>

              <Tabs defaultValue="explanation" className="w-full">
                <TabsList className="bg-slate-800/80 border-slate-700">
                  <TabsTrigger value="explanation">Deep Analysis</TabsTrigger>
                  <TabsTrigger value="metadata">Technical Specs</TabsTrigger>
                </TabsList>
                <TabsContent value="explanation" className="p-4 bg-slate-800/20 rounded-xl border border-slate-700/50 mt-2">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                      {result.explanation}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="metadata" className="p-4 bg-slate-800/20 rounded-xl border border-slate-700/50 mt-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-slate-400">LLM Model:</div>
                    <div className="text-slate-200 font-mono">{result.ai_meta?.model}</div>
                    <div className="text-slate-400">Processing Time:</div>
                    <div className="text-slate-200">{result.ai_meta?.time_seconds} seconds</div>
                    <div className="text-slate-400">Prompt Tokens:</div>
                    <div className="text-slate-200">{result.ai_meta?.tokens_prompt}</div>
                    <div className="text-slate-400">Completion Tokens:</div>
                    <div className="text-slate-200">{result.ai_meta?.tokens_completion}</div>
                    <div className="text-slate-400">Total Tokens:</div>
                    <div className="text-slate-200 font-bold">{result.ai_meta?.tokens_total}</div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform hover:scale-[1.01] active:scale-[0.99] rounded-2xl"
            disabled={loading || !text.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Analyzing Truthfulness...
              </>
            ) : (
              <>
                Verify
                <Search className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
