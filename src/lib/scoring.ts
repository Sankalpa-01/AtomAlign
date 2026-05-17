export function calculateGoalScore(uomType: string, target: string, achievement: string | null): number {
  // If they haven't logged any progress yet, their score is 0
  if (!achievement) return 0;

  // 1. ZERO: Zero = Success (e.g., Safety incidents)
  // Formula: If 0 -> 100%, else 0%
  if (uomType === "ZERO") {
    const numAchievement = parseFloat(achievement);
    if (isNaN(numAchievement)) return 0;
    return numAchievement === 0 ? 100 : 0;
  }

  // 2. TIMELINE: Date-based completion
  // Formula: If completion date is on or before deadline -> 100%
  if (uomType === "TIMELINE") {
    const targetDate = new Date(target).getTime();
    const achieveDate = new Date(achievement).getTime();
    if (isNaN(targetDate) || isNaN(achieveDate)) return 0;
    return achieveDate <= targetDate ? 100 : 0;
  }

  // Parse numbers for the numeric calculations
  const numTarget = parseFloat(target.replace(/[^0-9.-]+/g, "")); 
  const numAchievement = parseFloat(achievement.replace(/[^0-9.-]+/g, ""));
  
  if (isNaN(numTarget) || isNaN(numAchievement)) return 0;

  // 3. NUMERIC MIN: Higher is better (e.g., Sales Revenue)
  // Formula: Achievement ÷ Target
  if (uomType === "NUMERIC_MIN") {
    if (numTarget === 0) return 0;
    return Math.round((numAchievement / numTarget) * 100);
  }

  // 4. NUMERIC MAX: Lower is better (e.g., TAT, Cost)
  // Formula: Target ÷ Achievement
  if (uomType === "NUMERIC_MAX") {
    if (numAchievement === 0) return 0; // Avoid division by zero
    return Math.round((numTarget / numAchievement) * 100);
  }

  return 0;
}