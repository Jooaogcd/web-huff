// Huffman tree struct
class HuffmanNode {
    constructor(char, freq) {
        this.char = char;
        this.freq = freq;
        this.left = null;
        this.right = null; 
    }
}

function buildHuffmanTree(text) {
    if (!text) return null;

    const freqMap = new Map();
    for (const char of text) {
        freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }

    const nodes = Array.from(freqMap.entries()).map(
        ([char, freq]) => new HuffmanNode(char, freq)
    );

    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        
        const left = nodes.shift();
        const right = nodes.shift();
        
        const parent = new HuffmanNode('', left.freq + right.freq);
        parent.left = left;
        parent.right = right;
        
        nodes.push(parent);
    }

    return nodes[0];
}


function generateCodes(node, code, codes) {
    if (!node) return;

    if (!node.left && !node.right && node.char) {
        codes.set(node.char, code || '0');
        return;
    }

    generateCodes(node.left, code + '0', codes);
    generateCodes(node.right, code + '1', codes);
}


function compressText(text) {
    const tree = buildHuffmanTree(text);
    const codes = new Map();
    
    if (tree) {
        generateCodes(tree, '', codes);
    }

    let compressed = '';
    for (const char of text) {
        compressed += codes.get(char) || '';
    }

    return { compressed, tree: JSON.stringify(Array.from(codes.entries())), codes };
}


function decompressText(compressed, codesJson) {
    const codesArray = JSON.parse(codesJson);
    const reverseCodes = new Map();
    
    for (const [char, code] of codesArray) {
        reverseCodes.set(code, char);
    }

    let result = '';
    let current = '';
    
    for (const bit of compressed) {
        current += bit;
        if (reverseCodes.has(current)) {
            result += reverseCodes.get(current);
            current = '';
        }
    }

    return result;
}


function binaryToBytes(binary) {
    const padding = (8 - (binary.length % 8)) % 8;
    const paddedBinary = binary + '0'.repeat(padding);
    
    const bytes = new Uint8Array(Math.floor(paddedBinary.length / 8) + 1);
    bytes[0] = padding;
    
    for (let i = 0; i < paddedBinary.length; i += 8) {
        const byte = paddedBinary.slice(i, i + 8);
        bytes[Math.floor(i / 8) + 1] = parseInt(byte, 2);
    }
    
    return bytes;
}


function bytesToBinary(bytes) {
    const padding = bytes[0];
    let binary = '';
    
    for (let i = 1; i < bytes.length; i++) {
        binary += bytes[i].toString(2).padStart(8, '0');
    }
    
    return binary.slice(0, binary.length - padding);
}




async function compressFile() {
    const text = await currentFile.text();
    const originalSize = new Blob([text]).size;
    
    const { compressed, tree, codes } = compressText(text);
    const compressedBytes = binaryToBytes(compressed);
    
    const encoder = new TextEncoder();
    const treeBytes = encoder.encode(tree);
    const totalCompressed = new Uint8Array(4 + treeBytes.length + compressedBytes.length);
    
    const view = new DataView(totalCompressed.buffer);
    view.setUint32(0, treeBytes.length);
    
    totalCompressed.set(treeBytes, 4);
    totalCompressed.set(compressedBytes, 4 + treeBytes.length);
    
    const compressedSize = totalCompressed.length;
    const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
    
    resultData = totalCompressed;
    resultFilename = currentFile.name + '.huff';
    
    displayStats({
        originalSize,
        compressedSize,
        ratio,
        savings: originalSize - compressedSize
    });

    displayCodes(codes);
}


async function decompressFile() {
    const arrayBuffer = await currentFile.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    
    const view = new DataView(data.buffer);
    const treeSize = view.getUint32(0);
    
    const treeBytes = data.slice(4, 4 + treeSize);
    const compressedBytes = data.slice(4 + treeSize);
    
    const decoder = new TextDecoder();
    const tree = decoder.decode(treeBytes);
    const compressed = bytesToBinary(compressedBytes);
    
    const decompressed = decompressText(compressed, tree);
    
    const encoder = new TextEncoder();
    resultData = encoder.encode(decompressed);
    resultFilename = currentFile.name.replace('.huff', '');
    
    displayStats({
        compressedSize: data.length,
        decompressedSize: new Blob([decompressed]).size,
        chars: decompressed.length
    });
}
