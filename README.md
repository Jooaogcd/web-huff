# Web Huff

🗜️ An interactive web application for file compression and decompression using the Huffman Algorithm.

[![Netlify Status](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat&logo=netlify)](https://web-huff.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🔗 Links

- **Live Application:** [https://web-huff.netlify.app/](https://web-huff.netlify.app/)
- **Repository:** [https://github.com/Jooaogcd/web-huff](https://github.com/Jooaogcd/web-huff)

## 📖 About the Project

Web Huff is an educational and practical project that implements the **Huffman Compression Algorithm**, a lossless compression method widely used in formats such as ZIP, GZIP, JPEG, and MP3.

### What is Huffman Coding?

Huffman Coding is a greedy algorithm that assigns variable-length binary codes to characters based on their frequency of occurrence. More frequent characters receive shorter codes, resulting in efficient compression without data loss.

### Key Features

- ✅ **Lossless Compression** - Complete recovery of original text
- 📊 **Statistics Visualization** - Real-time compression rate and efficiency
- 🌳 **Binary Tree Construction** - Based on character frequency
- 💾 **Text File Compression** - Support for upload and download
- 🚀 **Intuitive Interface** - Modern and responsive user experience
- 🔄 **Reversible Process** - Compression and decompression in the browser

## 🛠️ Technologies Used

- **HTML5** - Semantic structure of the application
- **CSS3** - Styling and responsive design
- **JavaScript** - Compression/decompression logic and DOM manipulation
- **Netlify** - Hosting and continuous deployment

## 🚀 How It Works

### Compression Algorithm

1. **Frequency Calculation** - Analyzes the frequency of each character in the text
2. **Huffman Tree Construction** - Creates a bottom-up binary tree
3. **Code Generation** - Assigns unique binary codes to each character
4. **Encoding** - Replaces characters with their binary codes
5. **Result** - Compressed text with reduced bit size

### Compression Efficiency

The compression rate can vary from **~33%** (text with a single character) to **~87.5%** (text with highly repetitive patterns). The algorithm is optimal for character-based compression, especially effective for texts with unequal character distribution.

## 💻 Usage

![Application Screenshot](./assets/web-huff-usage.gif)

1. Open the [live application](https://web-huff.netlify.app/).
2. Paste or upload a text file to compress.
3. Click "Compress" to see the compressed output and statistics.
4. To decompress, paste the compressed text and click "Decompress".
5. Download the results as needed.

## 📂 Project Structure

```
web-huff/
├── index.html          # Main application page
│
├── assets/            # Images and GIFs used in this repository
│
├── css/
│   ├── global.css      # CSS reseting and base styles
│   └── styles.css      # Styles and design
│
├── scripts/
│   ├── huffman.js     # Huffman algorithm implementation
│
│   └── interface.js   # Interface logic and event handling
│
├── testing-files/     # Sample text files for testing
│
├── LICENCE            # MIT License file
│   
└── README.md          # This file
```

## 🎯 Use Cases

### Educational

- Learn about data structures (binary trees, priority queues)
- Understand lossless compression algorithms
- Visualize the practical functioning of Huffman Coding

### Practical

- Compress text before transmitting or storing
- Compare compression efficiency across different texts
- Demonstrate information theory and entropy concepts

### Development

- Foundation for implementing more complex compressors
- Component of text processing systems
- Reference for encoding algorithms

## 🔬 Compression Examples

### Repetitive Text

**Input:** "aaaaaabbbbcccd"  
**Compression Rate:** ~75%  
**Reason:** High repetition allows very short codes

### Varied Text

**Input:** "the quick brown fox jumps over the lazy dog"  
**Compression Rate:** ~40-50%  
**Reason:** More uniform character distribution

### Unique Text

**Input:** "abcdefghijklmnop"  
**Compression Rate:** ~33%  
**Reason:** Each character appears once, codes cannot be optimized

## 🤝 Contributing

Contributions are welcome! If you have suggestions, bug fixes, or new features:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

### Contribution Ideas

- [ ] Add graphical visualization of Huffman tree
- [ ] Implement compressed file download
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Advanced statistics (entropy, information gain)
- [ ] Comparison with other algorithms (LZW, RLE)
- [ ] Automated tests

## 📚 Resources and References

### Articles and Tutorials

- [W3Schools - Huffman Coding](https://www.w3schools.com/dsa/dsa_ref_huffman_coding.php)
- [Wikipedia - Huffman Coding](https://en.wikipedia.org/wiki/Huffman_coding)

### Reference Implementations

- [SamirPaulb/txt-compressor](https://github.com/SamirPaulb/txt-compressor)

- [kelreel/huffman-javascript](https://github.com/kelreel/huffman-javascript)

### Real-World Applications

- **TXT** - Text compression
- **JPEG** - Image compression
- **MP3** - Audio compression
- **JSON** - JSON compression
- **XML** - XML Compression

## 📄 License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 👤 Author

**João Cuzzuol Dias**


## ⭐ Give It a Star!

If this project was useful to you, consider giving it a ⭐ on the repository!
