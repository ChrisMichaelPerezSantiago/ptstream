import { useState } from "react";
import Plyr from "plyr-react";
import { X } from "lucide-react";
import { map, toLower } from "lodash";

import { PromoResult } from "../../types";

import "plyr-react/plyr.css";

type PlyrVideoPlayerProps = {
  promo: PromoResult;
  onClosePlayer: () => void;
};

export function PlyrVideoPlayer({
  promo,
  onClosePlayer,
}: PlyrVideoPlayerProps) {
  const [isFloating, setIsFloating] = useState(true);

  const sources = map(
    promo,
    ({ key, site, size, type }) =>
      ({
        src: key,
        provider: toLower(site),
        size: size,
        type: type,
      } as Plyr.Source)
  );

  return (
    <div
      className={`${
        isFloating
          ? "fixed bottom-4 right-10 w-1/3 z-50 animate-pip-drop-effect"
          : "relative w-3/4 mx-auto"
      } overflow-hidden rounded-lg aspect-w-16 aspect-h-9`}
    >
      {/* Close Button */}
      {isFloating && (
        <button
          className="absolute z-10 p-2 bg-transparent border-none rounded-full cursor-pointer top-2 right-2"
          onClick={() => {
            onClosePlayer();
            setIsFloating(false);
          }}
        >
          <X color="white" />
        </button>
      )}
      <Plyr
        source={{
          type: "video",
          sources: sources,
        }}
        options={{
          quality: {
            default: 1080,
            options: [1080, 720, 480],
            forced: true,
          },
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true,
          },
          disableContextMenu: false,
        }}
        controls={true}
      />
    </div>
  );
}

export default PlyrVideoPlayer;
