import * as React from "react";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  overlay?: boolean;
  "aria-label"?: string;
}

// Simple CSS loader with radial gradient animation
function Loading({
  className = "",
  overlay = false,
  "aria-label": ariaLabel = "Loading",
  style,
  ...props
}: LoadingProps) {
  const loaderStyle = {
    width: "20px",
    aspectRatio: "1",
    "--_g": "no-repeat radial-gradient(farthest-side,#000 94%,#0000)",
    background:
      "var(--_g) 0 0, var(--_g) 100% 0, var(--_g) 100% 100%, var(--_g) 0 100%",
    backgroundSize: "40% 40%",
    animation: "loader-animation 0.7s infinite",
    ...style,
  } as React.CSSProperties;

  const containerClass = overlay
    ? "fixed inset-0 z-50 bg-black/20 backdrop-blur-md flex items-center justify-center"
    : `fixed inset-0 z-50 flex items-center justify-center ${className}`;

  return (
    <>
      <style>{`
        @keyframes loader-animation {
          100% { background-position: 100% 0, 100% 100%, 0 100%, 0 0; }
        }
      `}</style>
      <div
        className={containerClass}
        role="status"
        aria-label={ariaLabel}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div style={loaderStyle} />
        </div>
      </div>
    </>
  );
}

export { Loading };
