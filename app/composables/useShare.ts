export function useShare() {
  const sharing = ref(false);

  async function shareAsImage(
    element: HTMLElement,
    filename = "strava-wrapped.png",
  ) {
    sharing.value = true;
    try {
      const { toPng } = await import("html-to-image");

      const bgColor = getComputedStyle(element).backgroundColor;
      const dataUrl = await toPng(element, {
        pixelRatio: 3,
        backgroundColor: bgColor,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } finally {
      sharing.value = false;
    }
  }

  return { sharing, shareAsImage };
}
