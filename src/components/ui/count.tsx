import { cn } from "@/lib/utils";

interface CountProps {
  count: number;
  maxCount?: number;
  variant?: "default" | "red" | "blue" | "green" | "yellow" | "gray";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  default: "bg-gray-200 text-black",
  red: "bg-red-500 text-white",
  blue: "bg-blue-500 text-white",
  green: "bg-green-500 text-white",
  yellow: "bg-yellow-500 text-white",
  gray: "bg-gray-500 text-white",
};

const sizeStyles = {
  sm: "px-1 py-0.5 text-xs",
  md: "px-1.5 py-0.5 text-xs",
  lg: "px-2 py-1 text-sm",
};

const shapeStyles = {
  sm: "rounded-sm",
  md: "rounded-sm",
  lg: "rounded-md",
};

export default function Count({
  count,
  maxCount = 99,
  variant = "default",
  size = "md",
  className,
}: CountProps) {
  if (count <= 0) {
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <div
      className={cn(
        "w-fit font-medium",
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[size],
        className
      )}
    >
      <p>{displayCount}</p>
    </div>
  );
}

// Export specific variants for convenience
export function UnreadCount({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <Count
      count={count}
      variant="red"
      size="sm"
      className={cn("rounded-full", className)}
    />
  );
}

export function BadgeCount({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return <Count count={count} variant="default" className={className} />;
}

export function NotificationCount({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <Count
      count={count}
      variant="blue"
      size="sm"
      className={cn("rounded-full", className)}
    />
  );
}
