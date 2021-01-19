'use strict';

import { computeHash } from "../dist/index.js";

const red = '\u001b[31m';
const green = '\u001b[32m';
const reset = '\u001b[0m';

const execTest = (msg, hash) => {
  const answer = computeHash(msg);
  const isCorrect = answer === hash;
  if(!isCorrect) {
    console.log(`${red}Error:${reset} Expected hash of ${msg} is ${hash} but got ${answer}`);
    return;
  }
  console.log(`${green}✔️ Success: ${reset}${msg} ==> ${answer}`);
  return;
}

execTest("sdfghj", "41e4b039aa6e77d313d603d44c9c2a3751a6cd2da13745edd8289158eede3ad1");
execTest("aiueo", "fa06926df12aec4356890d4847d43f79101c93548a6b65e4b57bcb651294beef");
execTest("This is the test. Organic SHA-256 implementation is confusing and hard but I did it.", "a03b2a6426bdac458f4f43b2bc3f27dd7cc583ccb5ff90de712e4efa1b4773f9");
execTest("全角文字のテスト", "a4e356a9af097db2d96ef63116808612d33849a72ee98a7e475387dae5203d5c");
execTest("全角文字のテスト2。この文字列にはadfsaなど半角文字が含まれ、最後のメッセージブロックもオーバーフローを起こします。", "fbe11354b634d1f2698aa34b427d16fd8b0979b77f7034c30109f76f95fcae68");
execTest("全角文字のテスト3。この文字列には✋などの絵文字が含まれ、最後のメッセージブロックもオーバーフローを起こします。🎄などの絵文字も全角と同じ処理を行えば正しくハッシュ値が生成されるはずです！", "093c29b4694243f617c6fa30bfb98683e0e8d2c751d836c4e3d04aa81208b396");
execTest("في مطعم قريب جنب السينيما بيعمل شاورما عربي.‏‏", "a850cf8553c44544cc1b52b34143c53085640190ddcf6752b4cf1fdab2b92eb4");
execTest("Где　туалет？","1816ed3a143d5763a6b6ee840ff0278e7f1cc1531a64798c48786a77139bd2c8");
