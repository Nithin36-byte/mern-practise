const studentName = "Rahul";
let studentAge = 22;
const isEnrolled = true;

const marks = [85, 90, 78, 92];

const student = {
    id: 101,
    name: "Rahul",
    marks: 85
};

const result = null;

console.log("Student Name:", studentName);
console.log("Student Age:", studentAge);
console.log("Is Enrolled:", isEnrolled);
console.log("Marks:", marks);
console.log("Student Details:", student);
console.log("Result:", result);

const marksObtained = 85;

// Conditional statement
if (marksObtained >= 90) {
    console.log("Grade: A");
} else if (marksObtained >= 75) {
    console.log("Grade: B");
} else if (marksObtained >= 50) {
    console.log("Grade: C");
} else {
    console.log("Result: Fail");
}

// For loop
console.log("Student Marks:");

for (let i = 0; i < marks.length; i++) {
    console.log(marks[i]);
}

// For...of loop
console.log("Displaying all marks:");

for (const mark of marks) {
    console.log(mark);
}

console.log("----- Regular Function -----");

// Regular function
function calculateTotal(marks) {
    let total = 0;

    for (const mark of marks) {
        total = total + mark;
    }

    return total;
}

const totalMarks = calculateTotal(marks);

console.log("Total Marks:", totalMarks);


console.log("----- Arrow Function -----");

// Arrow function
const calculateAverage = (marks) => {
    const total = calculateTotal(marks);
    return total / marks.length;
};

const averageMarks = calculateAverage(marks);

console.log("Average Marks:", averageMarks);

console.log("----- Array Methods -----");

// 1. map() - create a new array of marks with 5 bonus marks
const bonusMarks = marks.map((mark) => mark + 5);
console.log("Bonus Marks:", bonusMarks);

// 2. filter() - get marks that are 80 or above
const highMarks = marks.filter((mark) => mark >= 80);
console.log("Marks 80 and Above:", highMarks);

// 3. find() - find the first mark above 85
const firstHighMark = marks.find((mark) => mark > 85);
console.log("First Mark Above 85:", firstHighMark);

// 4. some() - check whether any mark is below 50
const hasFailedMark = marks.some((mark) => mark < 50);
console.log("Any Mark Below 50:", hasFailedMark);

// 5. reduce() - calculate the total marks
const totalUsingReduce = marks.reduce((total, mark) => {
    return total + mark;
}, 0);

console.log("Total Using Reduce:", totalUsingReduce);

console.log("----- Array Destructuring -----");

const studentMarks = [85, 90, 78, 92];

const [firstMark, secondMark, ...otherMarks] = studentMarks;

console.log("First Mark:", firstMark);
console.log("Second Mark:", secondMark);
console.log("Other Marks:", otherMarks);


console.log("----- Object Destructuring -----");

const studentDetails = {
    id: 101,
    name: "Rahul",
    age: 22,
    course: "MERN Stack"
};

const { id, name, course } = studentDetails;

console.log("Student ID:", id);
console.log("Student Name:", name);
console.log("Course:", course);

console.log("----- Spread Syntax -----");

// Copy an array and add more marks
const originalMarks = [85, 90, 78];
const updatedMarks = [...originalMarks, 95, 88];

console.log("Original Marks:", originalMarks);
console.log("Updated Marks:", updatedMarks);

// Copy an object and update a property
const originalStudent = {
    id: 101,
    name: "Rahul"
};

const updatedStudent = {
    ...originalStudent,
    course: "MERN Stack"
};

console.log("Updated Student:", updatedStudent);


console.log("----- Rest Syntax -----");

// Collect multiple arguments into an array
function calculateTotalMarks(...studentMarks) {
    let total = 0;

    for (const mark of studentMarks) {
        total = total + mark;
    }

    return total;
}

console.log("Total Marks:", calculateTotalMarks(85, 90, 78));
