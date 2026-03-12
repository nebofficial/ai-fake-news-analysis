"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface VerificationResultProps {
  result: {
    label: string
    confidence: number
    keywords: string[]
  }
}

export function VerificationResult({ result }: VerificationResultProps) {
  const isFake = result.label.toLowerCase() === "fake"
  const credibilityScore = isFake ? 100 - result.confidence : result.confidence

  const pieData = [
    { name: "Fake", value: isFake ? result.confidence : 100 - result.confidence },
    { name: "Real", value: isFake ? 100 - result.confidence : result.confidence },
  ]

  const barData = [
    {
      name: "Credibility Score",
      score: credibilityScore,
    },
  ]

  const COLORS = {
    fake: "hsl(var(--destructive))",
    real: "hsl(var(--success))",
  }

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Result</CardTitle>
          <CardDescription>AI analysis of the news article authenticity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Prediction:</span>
                <Badge
                  variant={isFake ? "destructive" : "default"}
                  className={!isFake ? "bg-success text-success-foreground" : ""}
                >
                  {isFake ? (
                    <>
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Fake News
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Real News
                    </>
                  )}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
                  <span className="text-sm font-bold">{result.confidence}%</span>
                </div>
                <Progress value={result.confidence} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Credibility Score:</span>
                  <span className="text-sm font-bold">{credibilityScore}%</span>
                </div>
                <Progress
                  value={credibilityScore}
                  className="h-2"
                  indicatorClassName={credibilityScore >= 70 ? "bg-success" : "bg-destructive"}
                />
              </div>
            </div>
          </div>

          {result.keywords.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Suspicious Keywords:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-destructive/10 text-destructive border-destructive/20"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualization Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Real vs Fake Distribution</CardTitle>
            <CardDescription>Probability breakdown of news authenticity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === "Fake" ? COLORS.fake : COLORS.real} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credibility Analysis</CardTitle>
            <CardDescription>Overall trustworthiness score</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill={credibilityScore >= 70 ? COLORS.real : COLORS.fake} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
