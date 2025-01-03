const upload = document.getElementById('upload');
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('text-input');
const addTextButton = document.getElementById('add-text');
const downloadButton = document.getElementById('download-pdf');

let pdfBytes = null;
let pdfDoc = null;
let pdfPage = null;
let viewport = null;

upload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
            pdfBytes = new Uint8Array(reader.result);
            pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            pdfPage = await pdfjsLib.getDocument({ data: pdfBytes }).promise.getPage(1);
            viewport = pdfPage.getViewport({ scale: 1.5 });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport,
            };
            await pdfPage.render(renderContext).promise;
        };
        reader.readAsArrayBuffer(file);
    }
});

addTextButton.addEventListener('click', async () => {
    if (!pdfDoc) return;

    const text = textInput.value;
    if (!text) return;

    const page = pdfDoc.getPages()[0];
    page.drawText(text, {
        x: 50,
        y: 700,
        size: 24,
        color: PDFLib.rgb(0, 0, 0),
    });

    pdfBytes = await pdfDoc.save();
    renderPDFWithText();
});

downloadButton.addEventListener('click', () => {
    if (!pdfBytes) return;

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edited.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

async function renderPDFWithText() {
    const editedPdfDoc = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    const editedPage = await editedPdfDoc.getPage(1);
    const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
    };
    await editedPage.render(renderContext).promise;
}
