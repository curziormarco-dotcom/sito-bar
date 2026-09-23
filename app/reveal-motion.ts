/** Motion stays within a short distance so reading never waits on a long slide. */
export function revealMotion(kind: string | undefined, compact: boolean) {
  const distance = compact ? 54 : 100;
  if (kind === "image") {
    return {
      frames: [
        { opacity: 0, clipPath: "inset(12% 0 88% 0)", transform: "scale(1.04)" },
        { opacity: 1, clipPath: "inset(0% 0 0% 0)", transform: "scale(1)" },
      ],
      duration: 2200,
    };
  }
  const transform = kind === "left" ? `translateX(-${distance}px)`
    : kind === "right" ? `translateX(${distance}px)`
    : kind === "down" ? "translateY(-48px)"
    : "translateY(64px)";
  return {
    frames: [{ opacity: 0, transform }, { opacity: 1, transform: "translate(0, 0)" }],
    duration: kind === "left" || kind === "right" ? 1900 : 1600,
  };
}
