import { useCallback, useState } from "react";

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(
    (element: HTMLElement = document.documentElement) => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        // Enter fullscreen
        if (element.requestFullscreen) {
          element.requestFullscreen().then(() => setIsFullscreen(true));
        } else if ((element as any).webkitRequestFullscreen) {
          (element as any).webkitRequestFullscreen(); // Safari
          setIsFullscreen(true);
        } else if ((element as any).msRequestFullscreen) {
          (element as any).msRequestFullscreen(); // IE11
          setIsFullscreen(true);
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => setIsFullscreen(false));
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen(); // Safari
          setIsFullscreen(false);
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen(); // IE11
          setIsFullscreen(false);
        }
      }
    },
    []
  );

  return { isFullscreen, toggleFullscreen };
};
