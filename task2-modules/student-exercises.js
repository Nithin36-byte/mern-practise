
console.log("----- Student Management Exercises -----");

// Create an array of student objects
const students = [
    { id: 101, name: "Rahul", marks: 85 },
    { id: 102, name: "Priya", marks: 92 },
    { id: 103, name: "Amit", marks: 68 },
    { id: 104, name: "Sneha", marks: 78 },
    { id: 105, name: "Kiran", marks: 95 }
];

// 1. Display all students
console.log("All Students:");
console.log(students);

// 2. Filter students who scored 80 or above
const highScorers = students.filter((student) => {
    return student.marks >= 80;
});

console.log("Students Scoring 80 or Above:");
console.log(highScorers);

// 3. Search for a student by ID
const searchedStudent = students.find((student) => {
    return student.id === 103;
});

console.log("Student with ID 103:");
console.log(searchedStudent);

// 4. Calculate average marks
const totalMarks = students.reduce((total, student) => {
    return total + student.marks;
}, 0);

const averageMarks = totalMarks / students.length;

console.log("Average Marks:", averageMarks);

// 5. Sort students alphabetically by name
const sortedStudents = [...students].sort((a, b) => {
    return a.name.localeCompare(b.name);
});

console.log("Students in Alphabetical Order:");

for (const student of sortedStudents) {
    console.log(student.name);
}

// 6. Transform student objects using map()
const studentNames = students.map((student) => {
    return student.name;
});

console.log("Student Names:", studentNames);
