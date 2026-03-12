"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { NewsVerificationForm } from "@/components/news-verification-form"
import {
    Clock,
    History,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    UserCircle,
    Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [history, setHistory] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("access_token")
        const storedUser = localStorage.getItem("user")

        if (!token || !storedUser) {
            router.push("/login")
            return
        }

        setUser(JSON.parse(storedUser))
        fetchDashboardData(token)
    }, [router])

    const fetchDashboardData = async (token: string) => {
        try {
            const [historyRes, statsRes] = await Promise.all([
                fetch("http://localhost:8000/api/history?limit=5", {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch("http://localhost:8000/api/history/stats", {
                    headers: { "Authorization": `Bearer ${token}` }
                })
            ])

            if (historyRes.ok) {
                const historyData = await historyRes.json()
                setHistory(historyData.items || [])
            }

            if (statsRes.ok) {
                const statsData = await statsRes.json()
                setStats(statsData)
            }
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err)
        } finally {
            setLoading(false)
        }
    }


    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                            <span className="text-slate-500">Welcome,</span> {user.username}
                        </h1>
                        <p className="text-slate-400 mt-2">Here's an overview of your verification activity.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <StatsCard
                        title="Total Verified"
                        value={stats?.total_verifications || 0}
                        icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
                    />
                    <StatsCard
                        title="Real Detected"
                        value={stats?.real_count || 0}
                        icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    />
                    <StatsCard
                        title="Fake Flagged"
                        value={stats?.fake_count || 0}
                        icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
                    />
                    <StatsCard
                        title="Avg Credibility"
                        value={`${stats?.avg_credibility || 0}%`}
                        icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                New Verification
                            </h2>
                            <NewsVerificationForm />
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <History className="w-5 h-5 text-blue-400" /> Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {loading ? (
                                    <p className="text-slate-500 italic">Loading history...</p>
                                ) : history.length > 0 ? (
                                    history.map((item) => (
                                        <HistoryItem key={item.id} item={item} />
                                    ))
                                ) : (
                                    <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500">
                                        No recent activity yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatsCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
    return (
        <Card className="bg-slate-900/40 border-white/5 backdrop-blur-md">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">{title}</span>
                    {icon}
                </div>
                <div className="text-3xl font-black">{value}</div>
            </CardContent>
        </Card>
    )
}

function HistoryItem({ item }: { item: any }) {
    return (
        <div className="p-4 rounded-xl bg-slate-900/30 border border-white/5 hover:border-blue-500/20 transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-2">
                <Badge variant={item.prediction_label === "Real" ? "default" : "destructive"}>
                    {item.prediction_label}
                </Badge>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString()}
                </div>
            </div>
            <h4 className="text-sm font-bold text-slate-300 line-clamp-2 group-hover:text-white transition-colors">
                {item.title || item.text_content}
            </h4>
        </div>
    )
}
