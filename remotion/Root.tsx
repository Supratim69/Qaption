import React from "react";
import { Composition } from "remotion";
import { VideoComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="VideoWithCaptions"
                component={VideoComposition}
                durationInFrames={300}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{
                    videoUrl: "",
                    captions: [],
                    style: "bottom-centered" as const,
                }}
            />
        </>
    );
};
