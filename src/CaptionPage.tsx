import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { TikTokPage } from "@remotion/captions";

const KEYWORDS = [
  "Claude",
  "Code",
  "Whisper",
  "Remotion",
  "自動",
  "キーワード",
  "強調",
  "コード",
  "再現性",
];

const isKeyword = (text: string): boolean => {
  return KEYWORDS.some((kw) => text.trim().includes(kw));
};

export const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = page.startMs + (frame / fps) * 1000;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          borderRadius: 12,
          padding: "16px 32px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {page.tokens.map((token, i) => {
          const isCurrent =
            token.fromMs <= currentTimeMs && token.toMs > currentTimeMs;
          const keyword = isKeyword(token.text);

          let color = "white";
          if (isCurrent) {
            color = "#39E508";
          } else if (keyword) {
            color = "#FFD700";
          }

          return (
            <span
              key={i}
              style={{
                color,
                fontSize: keyword ? 64 : 56,
                fontWeight: 700,
                fontFamily: "'Zen Kaku Gothic New', sans-serif",
                textShadow: isCurrent
                  ? "0 0 20px #39E508, 0 0 40px #39E50860"
                  : keyword
                    ? "0 0 10px #FFD70080"
                    : "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
