function processArray(arr) {
  let evenNumbers = arr.filter(num => num % 2 === 0);
  let doubled = evenNumbers.map(num => num * 2);
  let sum = doubled.reduce((acc, val) => acc + val, 0);

  console.log("Original Array:", arr);
  console.log("Even Numbers:", evenNumbers);
  console.log("Doubled Numbers:", doubled);
  console.log("Sum of Doubled Numbers:", sum);
}

processArray([1, 2, 3, 4, 5, 6]);
