#!/user/bin/env node
// src/index.ts
function main() {
    const name = process.argv[2] || "World";
    console.log(`Hello, ${name}!`);
}
main();
export {};
