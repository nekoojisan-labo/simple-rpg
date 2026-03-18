import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  staticFile,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption } from "@remotion/captions";
import { CaptionPage } from "./CaptionPage";
import { ChapterTitle } from "./ChapterTitle";

// Load captions from the JSON file
import captionsData from "../public/captions.json";

const captions: Caption[] = captionsData as Caption[];

export const CaptionDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: 2000,
  });

  const totalFrames = useVideoConfig().durationInFrames;

  // Chapter title takes the first 2 seconds (60 frames)
  const chapterDuration = 60;
  // Captions start after chapter title
  const captionOffset = chapterDuration;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f0f1a 0%, #1a1028 50%, #0f0f1a 100%)",
      }}
    >
      {/* Chapter title card */}
      <Sequence from={0} durationInFrames={chapterDuration}>
        <ChapterTitle chapterNumber={1} title="Claude Code × Remotion" />
      </Sequence>

      {/* Main content background after chapter */}
      <Sequence from={captionOffset} durationInFrames={totalFrames - captionOffset}>
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, #0f0f1a 0%, #1a1028 50%, #0f0f1a 100%)",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
          }}
        >
          {/* Center content area */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#fefcf9",
              textAlign: "center",
              textShadow: "0 0 20px #3b82f640",
            }}
          >
            TikTok風 字幕デモ
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* TikTok-style captions overlay */}
      <Sequence from={captionOffset} durationInFrames={totalFrames - captionOffset}>
        <AbsoluteFill>
          {pages.map((page, index) => {
            const nextPage = pages[index + 1];
            const startFrame = Math.round((page.startMs / 1000) * fps);
            const endFrame = nextPage
              ? Math.round((nextPage.startMs / 1000) * fps)
              : totalFrames - captionOffset;

            return (
              <Sequence
                key={index}
                from={startFrame}
                durationInFrames={Math.max(1, endFrame - startFrame)}
              >
                <CaptionPage page={page} />
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
