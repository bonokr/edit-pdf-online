document.addEventListener('DOMContentLoaded', () => {
    const viewerElement = document.getElementById('viewer');

    WebViewer(
        {
            path: 'https://unpkg.com/@pdftron/webviewer@8.11.0/lib', // Path to the WebViewer library
            initialDoc: 'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf', // Sample PDF
            licenseKey: 'demo:1735556585191:7eb9d5540300000000763d80855e84f1932544d91f1576ce83a4dc4926' // Replace with your PDFTron license key
        },
        viewerElement
    ).then((instance) => {
        const { UI } = instance;
        // Enable full toolbar
        UI.enableElements(['annotationToolsButton', 'textPopup', 'toolsHeader']);
        // Customize the UI
        instance.setTheme('light'); // Options: light, dark
        // Load additional features if needed
        console.log('WebViewer is initialized');
    });
});
