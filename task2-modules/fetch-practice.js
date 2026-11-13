async function getStudent() {
    console.log("Loading student details...");

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users/1"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch student details");
        }

        const student = await response.json();

        console.log("Student Name:", student.name);
        console.log("Email:", student.email);
        console.log("City:", student.address.city);

    } catch (error) {
        console.log("Error:", error.message);
    }
}

getStudent();