"use client";

import { useBrandStore } from "@/store/brand-store";
import { SplashScreen } from "@/components/SplashScreen";
import { QuestionnaireFlow } from "@/components/questionnaire/QuestionnaireFlow";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ResultsScreen } from "@/components/output/ResultsScreen";

export default function Home() {
  const screen = useBrandStore((s) => s.screen);

  return (
    <main className="min-h-screen">
      {screen === "splash" && <SplashScreen />}
      {screen === "questionnaire" && <QuestionnaireFlow />}
      {screen === "loading" && <LoadingScreen />}
      {screen === "results" && <ResultsScreen />}
    </main>
  );
}
