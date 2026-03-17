import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

// --- Color palette from the site ---
const COLORS = {
  primary: "#1a1410",
  secondary: "#8f7355",
  accent: "#3b82f6",
  bgMain: "#fefcf9",
  bgAlt: "#f5f0e8",
  bgDark: "#1a1410",
  textInverse: "#fefcf9",
};

// --- Scene 1: Title screen ---
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const glowIntensity = interpolate(
    frame,
    [0, 30, 60],
    [0, 30, 15],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, #2a2018 0%, ${COLORS.bgDark} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
      }}
    >
      {/* Decorative particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = 10 + (i * 37) % 80;
        const y = 10 + (i * 53) % 80;
        const delay = i * 3;
        const particleOpacity = interpolate(
          frame,
          [delay, delay + 20, delay + 40],
          [0, 0.6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: COLORS.accent,
              opacity: particleOpacity,
              boxShadow: `0 0 8px ${COLORS.accent}`,
            }}
          />
        );
      })}

      <div style={{ textAlign: "center", transform: `scale(${titleScale})` }}>
        <div
          style={{
            fontSize: 28,
            color: COLORS.secondary,
            letterSpacing: "0.3em",
            marginBottom: 16,
          }}
        >
          nekoojisan presents
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: COLORS.textInverse,
            textShadow: `0 0 ${glowIntensity}px ${COLORS.accent}, 0 0 ${glowIntensity * 2}px ${COLORS.accent}40`,
            letterSpacing: "0.05em",
          }}
        >
          Simple RPG
        </div>
        <div
          style={{
            fontSize: 24,
            color: COLORS.secondary,
            marginTop: 20,
            opacity: subtitleOpacity,
            letterSpacing: "0.15em",
          }}
        >
          Quality × Crazy Ideas
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Feature highlights ---
const features = [
  { icon: "⚔️", title: "バトルシステム", desc: "戦略的なターン制バトル" },
  { icon: "🗺️", title: "冒険の世界", desc: "広大なマップを探索しよう" },
  { icon: "🧙", title: "キャラクター", desc: "個性豊かな仲間たち" },
  { icon: "✨", title: "魔法とスキル", desc: "多彩なアビリティを習得" },
];

const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.bgDark} 0%, #2a1f15 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color: COLORS.textInverse,
          marginBottom: 60,
          opacity: interpolate(frame, [0, 15], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        ゲームの特徴
      </div>
      <div
        style={{
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
          justifyContent: "center",
          maxWidth: 900,
        }}
      >
        {features.map((f, i) => {
          const delay = 10 + i * 12;
          const s = spring({
            frame: frame - delay,
            fps,
            config: { damping: 10, stiffness: 80 },
          });
          const cardScale = interpolate(s, [0, 1], [0.5, 1]);
          const cardOpacity = interpolate(s, [0, 1], [0, 1]);

          return (
            <div
              key={i}
              style={{
                width: 180,
                padding: 24,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 16,
                border: `1px solid ${COLORS.secondary}40`,
                textAlign: "center",
                transform: `scale(${cardScale})`,
                opacity: cardOpacity,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{f.icon}</div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: COLORS.textInverse,
                  marginBottom: 8,
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 14, color: COLORS.secondary }}>
                {f.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Gameplay preview (simulated RPG screen) ---
const GameplayScene: React.FC = () => {
  const frame = useCurrentFrame();

  const heroHp = interpolate(frame, [30, 50], [100, 72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const enemyHp = interpolate(frame, [15, 30], [100, 45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const attackFlash =
    frame >= 15 && frame <= 18
      ? interpolate(frame, [15, 16, 18], [0, 1, 0])
      : 0;

  const shakeX =
    frame >= 15 && frame <= 20
      ? Math.sin(frame * 8) * 6 * (1 - (frame - 15) / 5)
      : 0;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #1a2a1a 0%, #0a150a 100%)`,
        fontFamily: "'Space Grotesk', monospace",
        padding: 60,
      }}
    >
      {/* Flash effect */}
      <AbsoluteFill
        style={{
          background: `rgba(255,255,255,${attackFlash * 0.4})`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Battle UI */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Hero side */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 120, marginBottom: 16 }}>🗡️</div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
            勇者
          </div>
          <HpBar hp={heroHp} maxHp={100} color="#4ade80" />
          <div style={{ color: "#9ca3af", fontSize: 14, marginTop: 4 }}>
            HP {Math.round(heroHp)}/100
          </div>
        </div>

        {/* VS */}
        <div
          style={{
            fontSize: 48,
            color: COLORS.accent,
            fontWeight: 700,
            opacity: interpolate(frame, [5, 15], [0, 1], {
              extrapolateRight: "clamp",
            }),
            textShadow: `0 0 20px ${COLORS.accent}`,
          }}
        >
          VS
        </div>

        {/* Enemy side */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 120, marginBottom: 16 }}>🐉</div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
            ドラゴン
          </div>
          <HpBar hp={enemyHp} maxHp={100} color="#f87171" />
          <div style={{ color: "#9ca3af", fontSize: 14, marginTop: 4 }}>
            HP {Math.round(enemyHp)}/100
          </div>
        </div>
      </div>

      {/* Battle log */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 60,
          right: 60,
          background: "rgba(0,0,0,0.7)",
          border: "1px solid #4b5563",
          borderRadius: 8,
          padding: "16px 24px",
          color: "#e5e7eb",
          fontSize: 18,
        }}
      >
        {frame < 15 && "勇者の攻撃！"}
        {frame >= 15 && frame < 30 && "勇者は剣で斬りつけた！ 55ダメージ！"}
        {frame >= 30 && frame < 50 && "ドラゴンの反撃！ ブレスを吐いた！ 28ダメージ！"}
        {frame >= 50 && "勇者はスキル「閃光斬」を発動した！"}
      </div>
    </AbsoluteFill>
  );
};

const HpBar: React.FC<{ hp: number; maxHp: number; color: string }> = ({
  hp,
  maxHp,
  color,
}) => (
  <div
    style={{
      width: 160,
      height: 12,
      background: "#374151",
      borderRadius: 6,
      overflow: "hidden",
      marginTop: 8,
    }}
  >
    <div
      style={{
        width: `${(hp / maxHp) * 100}%`,
        height: "100%",
        background: color,
        borderRadius: 6,
        transition: "width 0.3s ease",
      }}
    />
  </div>
);

// --- Scene 4: Call to action ---
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 10 } });
  const btnPulse = interpolate(
    frame,
    [30, 45, 60, 75],
    [1, 1.05, 1, 1.05],
    { extrapolateRight: "extend" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, #1a2040 0%, ${COLORS.bgDark} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Zen Kaku Gothic New', sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.textInverse,
            marginBottom: 20,
          }}
        >
          冒険の世界へ
        </div>
        <div
          style={{
            fontSize: 24,
            color: COLORS.secondary,
            marginBottom: 48,
          }}
        >
          あなたの物語が、今始まる
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "18px 48px",
            background: COLORS.accent,
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
            borderRadius: 8,
            letterSpacing: "0.1em",
            transform: `scale(${btnPulse})`,
            boxShadow: `0 0 30px ${COLORS.accent}60`,
          }}
        >
          PLAY NOW
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 16,
            color: COLORS.secondary,
            opacity: interpolate(frame, [40, 60], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          nekoojisanの部屋
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const RpgIntroVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <TitleScene />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <FeaturesScene />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <GameplayScene />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};
