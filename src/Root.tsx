import React from "react";
import { Composition } from "remotion";
import { RpgIntroVideo } from "./RpgIntroVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RpgIntroVideo"
        component={RpgIntroVideo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
