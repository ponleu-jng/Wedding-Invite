import html2canvas from 'html2canvas';

/**
 * Capture an element as a high-resolution PNG data URL and trigger download
 */
export async function captureAndDownloadCard(elementId: string, filename = 'Hong_ReakSmey_Wedding_Invitation_Card.png'): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element #${elementId} not found for capture`);
    return null;
  }

  try {
    // Generate crisp canvas with scale 2.5
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FCFBF7',
      logging: false,
      ignoreElements: (el) => {
        // Exclude interactive forms and floating action buttons that shouldn't appear in print/card image
        return el.classList.contains('no-export') || el.tagName.toLowerCase() === 'form';
      }
    });

    const dataUrl = canvas.toDataURL('image/png');

    // Trigger instant download on browser
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return dataUrl;
  } catch (err) {
    console.error('Failed to capture card with html2canvas:', err);
    return null;
  }
}
