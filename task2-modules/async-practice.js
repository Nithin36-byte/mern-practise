console.log("Starting student information...");

// Create a Promise
function getStudent() {
    return new Promise((resolve, reject) => {
        const student = {
            id: 101,
            name: "Rahul",
            course: "MERN Stack"
        };

        resolve(student);
    });
}

// Use async/await to get the student information
async function displayStudent() {
    const student = await getStudent();

    console.log("Student ID:", student.id);
    console.log("Student Name:", student.name);
    console.log("Course:", student.course);
}

// Call the async function
displayStudent();