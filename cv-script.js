// Download CV as HTML file
function downloadHTML() {
    const element = document.documentElement.outerHTML;
    const blob = new Blob([element], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${getFormattedDate()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Download CV as PDF file
function downloadPDF() {
    const element = document.getElementById('cv-content');
    const opt = {
        margin: 10,
        filename: `CV_${getFormattedDate()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    // Check if html2pdf library is loaded
    if (typeof html2pdf === 'undefined') {
        // Load the library dynamically
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = function() {
            html2pdf().set(opt).from(element).save();
        };
        document.head.appendChild(script);
    } else {
        html2pdf().set(opt).from(element).save();
    }
}

// Get formatted date for filename
function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
