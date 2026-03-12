// API Response Types

export interface User {
  id: number
  username: string
  email?: string
  created_at?: string
}

export interface AuthResponse {
  message: string
  user: User
  access_token: string
  refresh_token: string
}

export interface UserStats {
  total_verifications: number
  fake_count: number
  real_count: number
  avg_credibility: number
  recent_verifications: number
}

export interface AnalysisScores {
  emotional_tone: number
  factual_tone: number
  neutrality_score: number
  sensational_score: number
  exaggeration_score: number
  clickbait_score: number
  sentiment?: {
    polarity: number
    subjectivity: number
  }
}

export interface SourceAnalysis {
  domain: string | null
  reliability_score: number
  is_trusted: boolean
  trusted_similarity: number
  claim_consistency: number
  category: string
}

export interface HighlightedPhrase {
  text: string
  start: number
  end: number
  reason: string
  category: string
  severity: 'high' | 'medium' | 'low'
}

export interface SuspiciousPhrase {
  text: string
  start: number
  end: number
  category: string
  reason: string
}

export interface ExtractedInfo {
  title: string
  authors: string[]
  url: string
}

export interface CredibilityBreakdown {
  ml_component: number
  linguistic_quality: number
  source_quality: number
  claim_consistency: number
}

export interface PredictRequest {
  text?: string
  url?: string
}

export interface PredictResponse {
  verification_id: number
  label: 'Real' | 'Fake'
  confidence: number
  credibility_score: number
  credibility_level: 'high' | 'medium' | 'low' | 'very_low'
  analysis: AnalysisScores
  source_analysis: SourceAnalysis
  suspicious_phrases: SuspiciousPhrase[]
  highlighted_text: HighlightedPhrase[]
  reason_summary: string
  credibility_explanation: string
  extracted_info?: ExtractedInfo
  model_info: {
    loaded: boolean
    note?: string
  }
}

export interface VerificationHistoryItem {
  id: number
  text_content: string
  url?: string
  title?: string
  prediction_label: 'Real' | 'Fake'
  confidence_score: number
  credibility_score: number
  created_at: string
}

export interface VerificationDetail extends VerificationHistoryItem {
  analysis?: {
    emotional_tone: number
    factual_tone: number
    neutrality_score: number
    sensational_score: number
    exaggeration_score: number
    clickbait_score: number
    reason_summary: string
    suspicious_phrases: SuspiciousPhrase[]
    highlighted_text: HighlightedPhrase[]
  }
  source_analysis?: SourceAnalysis
}

export interface HistoryResponse {
  items: VerificationHistoryItem[]
  total: number
  limit: number
  offset: number
  has_more: boolean
}

export interface TrendData {
  date: string
  total: number
  fake: number
  real: number
  avg_credibility: number
}

export interface AnalyticsSummary extends UserStats {
  trends?: TrendData[]
}

// Component Props Types

export interface CredibilityMeterProps {
  score: number
  level?: 'high' | 'medium' | 'low' | 'very_low'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export interface LinguisticScoresProps {
  scores: AnalysisScores
}

export interface HighlightedTextViewerProps {
  text: string
  highlights: HighlightedPhrase[]
}

export interface SourceBadgeProps {
  domain: string | null
  reliabilityScore: number
  isTrusted: boolean
  category?: string
}

export interface AnalysisPanelProps {
  analysis: AnalysisScores
  sourceAnalysis: SourceAnalysis
  suspiciousPhrases: SuspiciousPhrase[]
  reasonSummary: string
}

export interface HistoryTableProps {
  items: VerificationHistoryItem[]
  onViewDetails: (id: number) => void
  onDelete: (id: number) => void
  onDownloadPdf: (id: number) => void
}
