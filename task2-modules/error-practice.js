async function getStudentDetails() {
    try {
        const student = {
            id: 101,
            name: "",
            course: "MERN Stack"
        };

        if (!student.name) {
            throw new Error("Student name is missing");
        }

        console.log("Student Details:", student);
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        console.log("Student search completed.");
    }
}

getStudentDetails();