let numbers = [45, 12, 89, 33, 7];

let largest = Math.max(...numbers);
let smallest = Math.min(...numbers);

let ascending = [...numbers].sort((a, b) => a - b);
let descending = [...numbers].sort((a, b) => b - a);

console.log("Numbers:", numbers);
console.log("Largest:", largest);
console.log("Smallest:", smallest);
console.log("Ascending:", ascending);
console.log("Descending:", descending);
