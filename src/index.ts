"use strict";

// 文字列を引数にとり、64の倍数bytesのHex文字列を返す
const padding = (M: string): string => {
  let sizeLastBlock: number = 64; // Mの末尾のブロックサイズ
  const sizeMLengthBuffer: number = 8; // 最終的なメッセージの末尾8bytesはMのサイズを記述する
  const sizeDivision: number = 1; // メッセージバイトと余りの0バイトの区切り（0x80）
  const sizeMaxBlock: number = sizeLastBlock - sizeMLengthBuffer - sizeDivision; // メッセージバイトは55bytes以下であれば良い
  const sizeM: number = encodeURI(M).replace(/%../g, "*").length;
  const sizeLastM: number = sizeM % 64;
  const isOverflow: boolean = sizeMaxBlock < sizeLastM;

  if (isOverflow) sizeLastBlock = 128; // Mの最後のブロックのバイトサイズが55bytesを超えていると1ブロックに格納できないため１ブロック追加する
  // Mを16進数文字列に変換
  const hexStringM: string = Array.from((new TextEncoder()).encode(M)).map(v => v.toString(16)).join("");
  // 余りの0の配列を生成
  const sizeExtra: number = (sizeLastBlock - sizeMLengthBuffer - sizeDivision - sizeLastM) * 2;
  const hexExtraString: string = Array(sizeExtra).fill(0).join("");
  // Mのサイズを8bytesで表現する
  const hexSizeM : string= (sizeM * 8).toString(16);
  const hex8bytesLengthM: string = Array(16 - hexSizeM.length).fill(0).concat(hexSizeM).join("");
  // 64bytesの倍数になったPaddedStringを生成
  const resultString: string = hexStringM + "80" + hexExtraString + hex8bytesLengthM;

  return resultString;
};

// 64の倍数bytesのHex文字列を引数にとり、64bytesごとに切り分けた配列を返す
const divideM = (M: string): string[] => {
  // 文字列として扱っているので64bytesは128文字
  const arrayM: RegExpMatchArray | null = M.match(/.{128}/g);

  if (!arrayM) throw new Error("Failed to divide message");

  return arrayM;
};

const ch = (x: number, y: number, z: number): number => ((x & y) ^ (~x & z)) >>> 0;

const maj = (x: number, y: number, z: number): number => ((x & y) ^ (x & z) ^ (y & z)) >>> 0;

const rotr = (x: number, n: number): number => ((x >>> n) | (x << (32 - n))) >>> 0;

const shr = (x: number, n: number): number => (x >>> n) >>> 0;

const upperSigma0 = (x: number): number => (rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)) >>> 0;

const upperSigma1 = (x: number): number => (rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)) >>> 0;

const lowerSigma0 = (x: number): number => (rotr(x, 7) ^ rotr(x, 18) ^ shr(x, 3)) >>> 0;

const lowerSigma1 = (x: number): number => (rotr(x, 17) ^ rotr(x, 19) ^ shr(x, 10)) >>> 0;

// 小さい方から64個の素数の立方根の小数点以下4bytesの定数
const K: number[] = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98,
  0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8,
  0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
  0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
  0xc67178f2
];

const mapW = (array64: number[], Mi: string[]): number[] => {
  for (let i = 0; i < 64; i++) {
    const hexNum: number = parseInt(Mi[i], 16);

    if (i < 16) {
      array64[i] = hexNum;
      continue;
    }
    const tmp: number = lowerSigma1(array64[i - 2]) + array64[i - 7] + lowerSigma0(array64[i - 15]) + array64[i - 16];

    array64[i] = (tmp & 0xffffffff) >>> 0;
  }
  return array64;
};

// メインの関数
export const computeHash = (M: string): string => {
  // ブロックごとにハッシュ値が格納される配列
  const H: number[] = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const paddedString: string = padding(M);
  const dividedM: string[] = divideM(paddedString);

  for (let i = 0; i < dividedM.length; i++) {
    const Mi: RegExpMatchArray | null = dividedM[i].match(/.{8}/g); // 64bytesのブロックをさらに4byteずつ刻んでいく

    if (!Mi) throw new Error("Failed to divide dividedM");
    const W: number[] = mapW(Array(64), Mi);
    let a, b, c, d, e, f, g, h;

    [a, b, c, d, e, f, g, h] = [...H];
    for (let t = 0; t < 64; t++) {
      const T1: number = ((h + upperSigma1(e) + ch(e, f, g) + K[t] + W[t]) & 0xffffffff) >>> 0;
      const T2: number = ((upperSigma0(a) + maj(a, b, c)) & 0xffffffff) >>> 0;

      h = g;
      g = f;
      f = e;
      e = ((d + T1) & 0xffffffff) >>> 0;
      d = c;
      c = b;
      b = a;
      a = ((T1 + T2) & 0xffffffff) >>> 0;
    }
    H[0] = ((a + H[0]) & 0xffffffff) >>> 0;
    H[1] = ((b + H[1]) & 0xffffffff) >>> 0;
    H[2] = ((c + H[2]) & 0xffffffff) >>> 0;
    H[3] = ((d + H[3]) & 0xffffffff) >>> 0;
    H[4] = ((e + H[4]) & 0xffffffff) >>> 0;
    H[5] = ((f + H[5]) & 0xffffffff) >>> 0;
    H[6] = ((g + H[6]) & 0xffffffff) >>> 0;
    H[7] = ((h + H[7]) & 0xffffffff) >>> 0;
  }

  let result: string = "";

  H.map(b => {
    let hashString: string = b.toString(16);
    if(hashString.length < 8) {
      const extraZeros: string = Array(8 - hashString.length).fill(0).join('');
      hashString = extraZeros + hashString;
    }
    result += hashString;
  });
  if(result.length !== 64) throw new Error("Hash result is not 32bytes");

  return result;
};

