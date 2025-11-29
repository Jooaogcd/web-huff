
class HuffmanNode {
    constructor(byte, freq) {
        this.byte = byte;  // store the byte value (0-255)
        this.freq = freq;
        this.left = null;
        this.right = null;
    }
}

function buildHuffmanTree(bytes) {
    if (!bytes || bytes.length === 0) return null;

    const freqMap = new Map();
    for (const byte of bytes) {
        freqMap.set(byte, (freqMap.get(byte) || 0) + 1);
    }

    const nodes = Array.from(freqMap.entries()).map(
        ([byte, freq]) => new HuffmanNode(byte, freq)
    );

    // building the tree
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        
        const left = nodes.shift();
        const right = nodes.shift();

        const parent = new HuffmanNode(null, left.freq + right.freq);
        parent.left = left;
        parent.right = right;
        
        nodes.push(parent);
    }

    return nodes[0];
}

function generateCodes(node, code, codes) {
    if (!node) return;

    // Leaf node - valid byte
    if (!node.left && !node.right && node.byte !== null) {
        codes.set(node.byte, code || '0');
        return;
    }

    generateCodes(node.left, code + '0', codes);
    generateCodes(node.right, code + '1', codes);
}

function compressBytes(bytes) {
    const tree = buildHuffmanTree(bytes);
    const codes = new Map();
    
    if (tree) {
        generateCodes(tree, '', codes);
    }

    // Compressing bytes using Huffman codes
    let compressed = '';
    for (const byte of bytes) {
        compressed += codes.get(byte) || '';
    }

    // serializing the codes table
    const codesArray = Array.from(codes.entries());
    
    return { compressed, codes, codesArray };
}

function decompressBytes(compressed, codesArray) {
    // rebuilds the reverse map (code -> byte)
    const reverseCodes = new Map();
    for (const [byte, code] of codesArray) {
        reverseCodes.set(code, byte);
    }

    const result = [];
    let current = '';
    
    // bit by bit decoding
    for (const bit of compressed) {
        current += bit;
        if (reverseCodes.has(current)) {
            result.push(reverseCodes.get(current));
            current = '';
        }
    }

    return new Uint8Array(result);
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
    const arrayBuffer = await currentFile.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const originalSize = bytes.length;
    
    const { compressed, codes, codesArray } = compressBytes(bytes);
    const compressedBytes = binaryToBytes(compressed);
    
    // codes table serialization
    const codesJson = JSON.stringify(codesArray);
    const encoder = new TextEncoder();
    const treeBytes = encoder.encode(codesJson);
    

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
    
    // extracts the size of the codes table
    const view = new DataView(data.buffer);
    const treeSize = view.getUint32(0);
    
    // extracts the codes table
    const treeBytes = data.slice(4, 4 + treeSize);
    const compressedBytes = data.slice(4 + treeSize);
    
    const decoder = new TextDecoder();
    const codesJson = decoder.decode(treeBytes);
    const codesArray = JSON.parse(codesJson);
    
    // converts compressed bytes to binary string
    const compressed = bytesToBinary(compressedBytes);
    
    // decompresses the data using the codes table
    const decompressed = decompressBytes(compressed, codesArray);
    
    resultData = decompressed;
    resultFilename = currentFile.name.replace('.huff', '');
    
    displayStats({
        compressedSize: data.length,
        decompressedSize: decompressed.length,
        bytes: decompressed.length
    });
}