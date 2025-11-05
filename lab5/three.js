function validateForm(name, email, age) {
  let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.trim() === "") {
    return " Name cannot be empty!";
  } else if (!emailPattern.test(email)) {
    return " Invalid email format!";
  } else if (isNaN(age) || age < 18 || age > 100) {
    return " Age must be between 18 and 100!";
  } else {
    return " Form is valid!";
  }
}

console.log(validateForm("Riya", "riya@gmail.com", 22));
