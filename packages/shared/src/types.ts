export type Goal = 'lean_cut' | 'lean_bulk' | 'bulk' | 'maintain' | 'cardio' | 'wellness'
export type Level = 'beginner' | 'intermediate' | 'advanced' | 'elite'
export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph'
export type Sex = 'Male' | 'Female'
export type WeightUnit = 'lbs' | 'kg'
export type HeightUnit = 'ft' | 'cm'
export type ActivityType = 'lifting' | 'cardio' | 'yoga' | 'pilates' | 'hiit' | 'mixed'
export type DietStyle = 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'lowcarb' | 'flexible'
export type LifeContext = 'balanced' | 'demanding' | 'transition' | 'social'
export type LifestyleLevel = 'sedentary' | 'light' | 'moderate' | 'active'

export interface UserProfile {
  name: string
  sex: Sex
  age: number
  bodyType: BodyType
  weight: number
  weightUnit: WeightUnit
  heightFt?: number
  heightIn?: number
  height?: number
  heightUnit: HeightUnit
  lifestyleLevel: LifestyleLevel
  daysPerWeek: number
  dietStyle: DietStyle
  lifeContext: LifeContext
  goal: Goal
  level: Level
  equipment: string[]
  activityType: ActivityType[]
  cal: number
  prot: number
  dur: number
  weightKg: number
  weightLbs: number
  heightCm: number
}

export interface CheckIn {
  id?: string
  userId?: string
  date: string
  sleep: number
  stress: number
  energy: number
  soreness: number
  notes?: string
}

export interface DailyPlan {
  day: string
  session: string
  exercises: Exercise[]
  nutrition: NutritionTarget
}

export interface Exercise {
  name: string
  sets: string
  reps: string
  rest: string
}

export interface NutritionTarget {
  calories: number
  protein: number
  carbs: number
  fat: number
}
