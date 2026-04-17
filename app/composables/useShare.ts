export function useShare() {
  const sharing = ref(false);

  async function shareAsImage(
    element: HTMLElement,
    filename = "strava-wrapped.png",
  ) {
    sharing.value = true;
    try {
      const html2canvas = (await import("html2canvas")).default;

      const canvas = await html2canvas(element, {
        backgroundColor: "#0d0d0d",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      sharing.value = false;
    }
  }

  return { sharing, shareAsImage };
}
