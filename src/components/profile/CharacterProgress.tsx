const MAX_LENGTH = 200;
const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; 

const getColorClass = (size: number) => {
  if (size > 190) {
    return "text-red-500";
  } else if (size > 180) {
    return "text-amber-500";
  } else if (size > 150) {
    return "text-yellow-500";
  }
 
  return "text-blue-500";
};

const CharacterProgress = ({ tweetSize }: { tweetSize: number }) => {
  const percentage = (tweetSize / MAX_LENGTH) * 100;
 
  const strokeOffset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  const progressColorClass = getColorClass(tweetSize);

  const remainingCount = MAX_LENGTH - tweetSize;
  const remainingColorClass =
    remainingCount < 10 && remainingCount > 0
      ? "text-red-500"
      : "text-green-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className={`w-10 h-10 transform -rotate-90 ${progressColorClass}`}
        viewBox="0 0 40 40"
      >
        {/* Background Circle (The Track) */}
        <circle
          className="text-gray-300"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r={RADIUS}
          cx="20"
          cy="20"
        />

        {/* Progress Circle (The Fill) */}
        <circle
          className={`${progressColorClass} transition-all duration-300`}
          strokeWidth="3"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={RADIUS}
          cx="20"
          cy="20"
        />
      </svg>

      {/* Center Text (Remaining Count) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${remainingColorClass}`}>
          {remainingCount}
        </span>
      </div>
    </div>
  );
};

export default CharacterProgress;
