document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const canvas = document.getElementById('pdf-canvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('text');
    const xInput = document.getElementById('x');
    const yInput = document.getElementById('y');
    const addTextButton = document.getElementById('add-text');
    const downloadButton = document.getElementById('download');
    let pdfBytes = null;

    upload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = async () => {
                pdfBytes = new Uint8Array(fileReader.result);
                const pdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
                const page = await pdfDoc.getPage(1);
                const viewport = page.getViewport({ scale: 1.5 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport,
                };
                await page.render(renderContext).promise;
            };
            fileReader.readAsArrayBuffer(file);
        }
    });

    addTextButton.addEventListener('click', async () => {
        const text = textInput.value;
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);

        if (text && !isNaN(x) && !isNaN(y) && pdfBytes) {
            const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            firstPage.drawText(text, {
                x,
                y,
                size: 12,
                color: PDFLib.rgb(0, 0, 0),
            });

            pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'edited.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

    downloadButton.addEventListener('click', () => {
        if (pdfBytes) {
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'edited.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
});
