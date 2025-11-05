let student = {
  name: "Riya Sharma",
  age: 20,
  grade: "A"
};

student.class = "B.Tech CSE";


student.grade = "A+";

for (let key in student) {
  console.log(`${key}: ${student[key]}`);
}
