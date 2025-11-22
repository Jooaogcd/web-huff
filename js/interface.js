
// setting the initial global state variables
let currentMode = 'compress';
let currentFile = null;
let resultData = null;
let resultFilename = '';

function setMode(mode) {
    currentMode = mode;
    currentFile = null;
    resultData = null;
    
    document.getElementById('compressBtn').classList.toggle('active', mode === 'compress');
    document.getElementById('decompressBtn').classList.toggle('active', mode === 'decompress');
    
    document.getElementById('uploadText').textContent = 'Click to select a file';
    document.getElementById('uploadHint').textContent = mode === 'compress' 
        ? 'Text files (.txt, .json, .xml, .csv)'
        : 'Compressed files (.huff)';
    
    document.getElementById('fileInput').accept = mode === 'compress' 
        ? '.txt,.json,.xml,.csv' 
        : '.huff';
    
    document.getElementById('processBtn').classList.remove('show');
    document.getElementById('statsSection').classList.remove('show');
    document.getElementById('processBtn').textContent = mode === 'compress' 
        ? 'Compress File' 
        : 'Decompress File';
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    currentFile = file;
    document.getElementById('uploadText').textContent = file.name;
    document.getElementById('processBtn').classList.add('show');
    document.getElementById('statsSection').classList.remove('show');
}


async function processFile() {
    if (!currentFile) return;

    document.getElementById('loader').classList.add('show');
    document.getElementById('processBtn').disabled = true;

    try {
        if (currentMode === 'compress') {
            await compressFile();
        } else {
            await decompressFile();
        }
    } catch (error) {
        alert('Error during ' + currentMode + ': ' + error.message);
    }

    document.getElementById('loader').classList.remove('show');
    document.getElementById('processBtn').disabled = false;
}


function displayStats(stats) {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '';

    if (currentMode === 'compress') {
        statsGrid.innerHTML = '<div class="stat-item">' +
                '<div class="stat-label">Original Size</div>' +
                '<div class="stat-value">' + (stats.originalSize / 1024).toFixed(2) + ' KB</div>' +
            '</div>' +
            '<div class="stat-item">' +
                '<div class="stat-label">Compressed Size</div>' +
                '<div class="stat-value" style="color: #667eea;">' + (stats.compressedSize / 1024).toFixed(2) + ' KB</div>' +
            '</div>' +
            '<div class="stat-item">' +
                '<div class="stat-label">Compression Rate</div>' +
                '<div class="stat-value" style="color: #11998e;">' + stats.ratio + '%</div>' +
            '</div>' +
            '<div class="stat-item">' +
                '<div class="stat-label">Space Saved</div>' +
                '<div class="stat-value" style="color: #764ba2;">' + (stats.savings / 1024).toFixed(2) + ' KB</div>' +
            '</div>';
    } else {
        statsGrid.innerHTML = '<div class="stat-item">' +
                '<div class="stat-label">Compressed Size</div>' +
                '<div class="stat-value" style="color: #667eea;">' + (stats.compressedSize / 1024).toFixed(2) + ' KB</div>' +
            '</div>' +
            '<div class="stat-item">' +
                '<div class="stat-label">Decompressed Size</div>' +
                '<div class="stat-value" style="color: #11998e;">' + (stats.decompressedSize / 1024).toFixed(2) + ' KB</div>' +
            '</div>' +
            '<div class="stat-item">' +
                '<div class="stat-label">Characters</div>' +
                '<div class="stat-value">' + stats.chars.toLocaleString() + '</div>' +
            '</div>';
    }

    document.getElementById('statsSection').classList.add('show');
}

function displayCodes(codes) {
    if (currentMode !== 'compress') {
        document.getElementById('codesTable').classList.remove('show');
        return;
    }

    const tbody = document.getElementById('codesTableBody');
    tbody.innerHTML = '';

    const sortedCodes = Array.from(codes.entries()).sort((a, b) => a[1].length - b[1].length);
    const displayCodes = sortedCodes.slice(0, 20);

    for (const [char, code] of displayCodes) {
        const row = tbody.insertRow();
        const displayChar = char === ' ' ? '␣' : char === '\n' ? '↵' : char === '\t' ? '⇥' : char;
        
        row.innerHTML = '<td style="font-family: monospace;">' + displayChar + '</td>' +
            '<td style="font-family: monospace; color: #667eea;">' + code + '</td>' +
            '<td>' + code.length + ' bits</td>';
    }

    if (codes.size > 20) {
        const row = tbody.insertRow();
        row.innerHTML = '<td colspan="3" style="text-align: center; color: #999; font-size: 0.9em;">Showing 20 of ' + codes.size + ' codes</td>';
    }

    document.getElementById('codesTable').classList.add('show');
}

function downloadResult() {
    if (!resultData) return;

    const blob = new Blob([resultData]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resultFilename;
    a.click();
    URL.revokeObjectURL(url);
}

// implementing drag and drop
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileInput').files = files;
        handleFileSelect({ target: { files: files } });
    }
});