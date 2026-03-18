import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption } from "@remotion/captions";
import { CaptionPage } from "./CaptionPage";
import { ChapterTitle } from "./ChapterTitle";

// Load captions from the JSON file
import captionsData from "../public/captions.json";

const captions: Caption[] = captionsData as Caption[];

// VOICEVOX で生成した音声ファイル一覧
// scripts/voicevox-generate.py --scenes scripts/scenes.json で生成
const VOICEOVER_FILES = [
  "voiceover/scene_000.wav",
  "voiceover/scene_001.wav",
  "voiceover/scene_002.wav",
  "voiceover/scene_003.wav",
];

export const CaptionDemo: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  const { pages } = createTikTokStyleCaptions({
    captions,
    combineTokensWithinMilliseconds: 2000,
  });

  // Chapter title takes the first 2 seconds (60 frames)
  const chapterDuration = 60;
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
      <Sequence from={captionOffset} durationInFrames={durationInFrames - captionOffset}>
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, #0f0f1a 0%, #1a1028 50%, #0f0f1a 100%)",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "'Zen Kaku Gothic New', sans-serif",
          }}
        >
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

      {/* VOICEVOX audio tracks - play after chapter title */}
      <Sequence from={captionOffset} durationInFrames={durationInFrames - captionOffset}>
        {VOICEOVER_FILES.map((file, i) => {
          // Each audio file starts at the corresponding caption group's start time
          const groupCaptions = getSceneCaptions(captions, i);
          const startFrame = groupCaptions.length > 0
            ? Math.round((groupCaptions[0].startMs / 1000) * fps)
            : 0;

          return (
            <Sequence key={i} from={startFrame}>
              <Audio src={staticFile(file)} volume={1} />
            </Sequence>
          );
        })}
      </Sequence>

      {/* TikTok-style captions overlay */}
      <Sequence from={captionOffset} durationInFrames={durationInFrames - captionOffset}>
        <AbsoluteFill>
          {pages.map((page, index) => {
            const nextPage = pages[index + 1];
            const startFrame = Math.round((page.startMs / 1000) * fps);
            const endFrame = nextPage
              ? Math.round((nextPage.startMs / 1000) * fps)
              : durationInFrames - captionOffset;

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

/**
 * キャプションをシーン（音声ファイル）ごとにグループ分けする。
 * scenes.json の区切りに合わせて、大きなギャップで分割する。
 */
function getSceneCaptions(allCaptions: Caption[], sceneIndex: number): Caption[] {
  const GAP_THRESHOLD_MS = 250;
  const groups: Caption[][] = [];
  let current: Caption[] = [];

  for (const cap of allCaptions) {
    if (current.length > 0) {
      const prev = current[current.length - 1];
      if (cap.startMs - prev.endMs > GAP_THRESHOLD_MS) {
        groups.push(current);
        current = [];
      }
    }
    current.push(cap);
  }
  if (current.length > 0) groups.push(current);

  return groups[sceneIndex] ?? [];
}
