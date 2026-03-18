import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface ChapterTitleProps {
  chapterNumber: number;
  title: string;
}

export const ChapterTitle: React.FC<ChapterTitleProps> = ({
  chapterNumber,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numberScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleTranslateY = interpolate(frame, [15, 35], [30, 0], {
    extrapolateRight: "clamp",
  });
  const lineWidth = interpolate(frame, [10, 40], [0, 300], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a14 70%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
      }}
    >
      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = 15 + ((i * 41) % 70);
        const y = 20 + ((i * 59) % 60);
        const delay = i * 4;
        const particleOpacity = interpolate(
          frame,
          [delay, delay + 15, delay + 30],
          [0, 0.5, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const particleY = interpolate(
          frame,
          [delay, delay + 30],
          [0, -20],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              transform: `translateY(${particleY}px)`,
              width: 3 + (i % 3),
              height: 3 + (i % 3),
              borderRadius: "50%",
              background: "#3b82f6",
              opacity: particleOpacity,
              boxShadow: "0 0 6px #3b82f6",
            }}
          />
        );
      })}

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 28,
            color: "#8f7355",
            letterSpacing: "0.3em",
            transform: `scale(${numberScale})`,
            marginBottom: 16,
          }}
        >
          CHAPTER {chapterNumber}
        </div>
        <div
          style={{
            width: lineWidth,
            height: 2,
            background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
            margin: "0 auto 24px",
          }}
        />
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#fefcf9",
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
            textShadow: "0 0 20px #3b82f640",
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
