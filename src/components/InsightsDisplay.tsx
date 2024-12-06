interface InsightsDisplayProps {
  insights: string[];
}

export function InsightsDisplay({ insights }: InsightsDisplayProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">AI Insights</h3>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded-lg">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
} 