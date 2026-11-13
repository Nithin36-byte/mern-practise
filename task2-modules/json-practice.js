console.log("----- JSON Practice -----");

const student = {
    id: 101,
    name: "Rahul",
    course: "MERN Stack"
};

// Convert JavaScript object into a JSON string
const jsonData = JSON.stringify(student);

console.log("JSON String:", jsonData);

// Convert JSON string back into a JavaScript object
const parsedStudent = JSON.parse(jsonData);

console.log("Student Name:", parsedStudent.name);


console.log("----- Optional Chaining -----");

const studentDetails = {
    name: "Rahul",
    address: {
        city: "Hyderabad"
    }
};

// Safely access a nested property
console.log("City:", studentDetails.address?.city);

// Access a property that does not exist
console.log("Phone:", studentDetails.contact?.phone);


console.log("----- Nullish Coalescing -----");

const phoneNumber = null;

const displayPhone = phoneNumber ?? "Phone number not available";

console.log("Phone Number:", displayPhone);