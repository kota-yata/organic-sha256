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

const superLongSentence = `Archibald Anderson, an able artist, and an acknowledged authority at all artistic assemblies after adventuring abroad all about Australia and America, and acquiring an admirable album artistically arranged, according as an accomplished artist accounted apt and appropriate, and admired amazingly among all artists as artistic and amusing, again, alleging as actuation an assiduous and absorbing activity, and an ambition all athirst after artistic accomplishments, and aiming at advantageous achievements, arranged another adventure across Asia, and accordingly appointing an accommodating and agreeable acquaintance, an affable Anglo-American, as agent (active agents accurately advised and amptly authorised always affording advantageous assistance, arranging affairs and adjusting articles, and anticipating and arresting awkward and adverse annoyances, and almost always alleviating anxiety and allaying anger and aggravation), after absent-mindedly and abstractedly, although apparently attentively, approving and adopting all arrangements as appropriate, and as auguring an agreeable adventure abroad, and after amiably answering all admiring acquaintances' affectionate adieus, abandoned an attractive abode, and attired as adventurers abroad always are (an attire apparently about as antiquated as any ancient and antediluvian age anytime adopted, and as affrighting and absurd as any art anytime achieved), and armed abundantly—apprehending attacks abroad—against any audacious assailants and aggressive assassins, Archibald advanced along, astonishingly active and agile, and approached an ancient alehouse, an appledealer's abode, an appledealer advertising as an amateur and aspiring artist, anxiously awaiting (as advertisements announced) all artist's and artist's agents arrangements anent adventuring abroad, and affording all advantageous assistance and appropriate aid; and again, advertisements also announced as an available acquisition, "an article aptly accommodating adventuring artists' apparatus and appliances, and all accustomed accessories;" and as Archibald arrived and asked about advantageous assistance and an article aptly-accommodating (as advertised) "adventuring artists' apparatus and appliances, and accustomed accessories," an applecart appeared approaching, and "an amateur and aspiring artist" alias an accommodating appledealer, actually affirmed and avowed (and an Anglo-American agent agreed and approved also), an applecart appropriately accounted and advertised as "an article aptly accommodating adventuring artists' apparatus and appliances, and accustomed accessories," and Archibald, astonished and angry, agitated and aggravated also at an appledealer's atrocious audacity, accounting an applecart an appropriate accommodation, assuming an awful aspect, acrimoniously abused all appledealers, and agents also, as absurd asses, and addledheaded apes, and accumulating annoying and abusive, affronting and arrogant accusations—aye and alas! and alackaday! abominable and appalling anathemas also—absolutely annulled all arrangements, and abruptly abandoned all artistic adventure across Asia; and as abandoning adventure amazed all artists, Archibald alleged as affording all admirers and acquaintances adequate answer, "An awkward accident."`;

console.time('Performance Test');
computeHash(superLongSentence);
console.timeEnd('Performance Test');
