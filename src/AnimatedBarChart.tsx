import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export type BarData = {
  label: string;
  value: number;
  color?: string;
};

export type AnimatedBarChartProps = {
  data: BarData[];
  title?: string;
  subtitle?: string;
  showValues?: boolean;
  staggerDelay?: number; // frames between each bar animation
};

const defaultColors = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
];

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  title = "Weekly Stats",
  subtitle,
  showValues = true,
  staggerDelay = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const maxValue = Math.max(...data.map((d) => d.value));

  // Title fade in
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 20], [-20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        padding: 60,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 40,
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: "#94a3b8",
              fontSize: 24,
              margin: "8px 0 0 0",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Chart */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          gap: 20,
          paddingBottom: 60,
        }}
      >
        {data.map((item, index) => {
          const barColor = item.color || defaultColors[index % defaultColors.length];
          const animationStart = 20 + index * staggerDelay;

          // Spring animation for the bar height
          const heightProgress = spring({
            frame: frame - animationStart,
            fps,
            config: {
              damping: 12,
              stiffness: 80,
              mass: 0.5,
            },
          });

          const barHeightPercent = (item.value / maxValue) * 100;
          const animatedHeight = barHeightPercent * Math.max(0, heightProgress);

          // Value counter animation
          const displayValue = Math.round(
            interpolate(
              frame,
              [animationStart, animationStart + 30],
              [0, item.value],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            )
          );

          // Label fade in
          const labelOpacity = interpolate(
            frame,
            [animationStart, animationStart + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                maxWidth: 120,
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              {/* Value label */}
              {showValues && (
                <div
                  style={{
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: 600,
                    marginBottom: 12,
                    opacity: labelOpacity,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {displayValue.toLocaleString()}
                </div>
              )}

              {/* Bar */}
              <div
                style={{
                  width: "100%",
                  height: `${animatedHeight}%`,
                  minHeight: animatedHeight > 0 ? 4 : 0,
                  background: `linear-gradient(180deg, ${barColor} 0%, ${barColor}99 100%)`,
                  borderRadius: "8px 8px 0 0",
                  boxShadow: `0 0 20px ${barColor}40`,
                  position: "relative",
                }}
              >
                {/* Shine effect */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
              </div>

              {/* Label */}
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 18,
                  fontWeight: 500,
                  marginTop: 16,
                  opacity: labelOpacity,
                  textAlign: "center",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
