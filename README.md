# Organic SHA-256
TypeScriptで0から書いたSHA-256のアルゴリズムです。全角文字、絵文字等複数バイトの文字でテスト済みです。

This is a SHA-256 (Secure Hash Algorithm 256bits) Implementation written in TypeScript. Works fine with multiple bytes character.

# Development
```
yarn install
```

TSコンパイル

```
yarn tsc
```

PR前

```
yarn test
yarn format
```

huskyとかはコミット多くなったら導入します。

# References
https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
