// Generates icon-192.png and icon-512.png using only Node.js built-ins
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

function crc32(buf) {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t   = Buffer.from(type, 'ascii');
  const body = Buffer.concat([t, data]);
  const crc  = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function makePNG(size) {
  const cx = size / 2, cy = size / 2;
  const diamondR  = size * 0.37;
  const lineWidth = size * 0.018;
  const dotR      = size * 0.055;
  const circleR   = size * 0.45;
  const circleW   = size * 0.012;

  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = [0]; // PNG filter byte
    for (let x = 0; x < size; x++) {
      const dx = x - cx, dy = y - cy;
      const eucDist = Math.sqrt(dx * dx + dy * dy);
      const manDist = Math.abs(dx) + Math.abs(dy);

      // Rounded background
      const cornerR = size * 0.18;
      const inRect  = x >= cornerR && x <= size - cornerR && y >= 0 && y <= size;
      const inRound = eucDist <= size / 2 - size * 0.01;

      let r = 6, g = 6, b = 15; // default: app bg color

      if (eucDist <= dotR) {
        // Center teal dot
        r = 0; g = 217; b = 177;
      } else if (Math.abs(manDist - diamondR) < lineWidth) {
        // Diamond outline
        r = 0; g = 217; b = 177;
      } else if (manDist < diamondR - lineWidth) {
        // Diamond interior — very subtle teal tint
        r = 10; g = 22; b = 20;
      } else if (Math.abs(eucDist - circleR) < circleW) {
        // Outer circle
        r = 0; g = 80; b = 65;
      }

      row.push(r, g, b);
    }
    rows.push(Buffer.from(row));
  }

  const raw        = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const out = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(out, 'icon-192.png'), makePNG(192));
fs.writeFileSync(path.join(out, 'icon-512.png'), makePNG(512));
console.log('✓ icon-192.png and icon-512.png written to public/');
