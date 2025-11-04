"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Heart } from "lucide-react"

export default function HeartDiseaseRiskDetection() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ prediction?: number; probability?: number; error?: string } | null>(null)
  const [formData, setFormData] = useState({
    bmi: "",
    smoker: "",
    alcoholDrinker: "",
    stroke: "",
    physicalHealth: "",
    mentalHealth: "",
    difficultyWalking: "",
    sex: "",
    ageCategory: "",
    race: "",
    diabetic: "",
    physicalActivity: "",
    generalHealth: "",
    sleepTime: "",
    asthma: "",
    kidneyDisease: "",
    skinCancer: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    // تحويل القيم حسب ما يتوقع الـ API
    const apiData = {
      "Unnamed: 0": 0,
      "bmi": Number(formData.bmi),
      "smoker": formData.smoker === "yes" ? 1 : 0,
      "alcoholDrinker": formData.alcoholDrinker === "yes" ? 1 : 0,
      "stroke": formData.stroke === "yes" ? 1 : 0,
      "physicalHealth": Number(formData.physicalHealth),
      "mentalHealth": Number(formData.mentalHealth),
      "difficultyWalking": formData.difficultyWalking === "yes" ? 1 : 0,
      "sex": formData.sex === "male" ? 1 : 0,
      "ageCategory": Number(formData.ageCategory),
      "race": Number(formData.race),
      "diabetic": formData.diabetic === "yes" ? 1 : 0,
      "physicalActivity": formData.physicalActivity === "yes" ? 1 : 0,
      "generalHealth": Number(formData.generalHealth),
      "sleepTime": Number(formData.sleepTime),
      "asthma": formData.asthma === "yes" ? 1 : 0,
      "kidneyDisease": formData.kidneyDisease === "yes" ? 1 : 0,
      "skinCancer": formData.skinCancer === "yes" ? 1 : 0,
    }

    try {
      const response = await fetch("https://mlflow-model-serving-production.up.railway.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error(error)
      setResult({ error: "An error occurred. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = Object.values(formData).every((val) => val !== "")

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Heart Disease Risk Assessment</h1>
          </div>
          <p className="text-gray-600">Enter your health details for a personalized risk prediction.</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg pb-6">
            <CardTitle className="text-2xl mb-1">Patient Information Form</CardTitle>
            <CardDescription className="text-blue-100 text-base">
              Fill all fields accurately for the best prediction.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Example: BMI */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">BMI</label>
                <input
                  type="number"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleInputChange}
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Add all other 16 fields similarly, e.g., smoker, alcoholDrinker, etc. */}
              {/* Example for select fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Smoker</label>
                <select
                  name="smoker"
                  value={formData.smoker}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

             
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-lg mt-4"
              >
                {loading ? "Analyzing..." : "Get Risk Assessment"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result && (
          <Card
            className={`shadow-lg border-0 mt-6 ${
              result.prediction === 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <CardContent className="pt-4 flex items-start gap-3">
              {result.prediction === 0 ? (
                <CheckCircle2 className="w-8 h-8 text-green-600 mt-1" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600 mt-1" />
              )}
              <div>
                <h3 className={`text-xl font-bold ${result.prediction === 0 ? "text-green-900" : "text-red-900"}`}>
                  {result.prediction === 0 ? "Low Risk" : "High Risk"}
                </h3>
                <p className="text-gray-700">
                  {result.probability ? `Probability: ${result.probability}` : result.error}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
