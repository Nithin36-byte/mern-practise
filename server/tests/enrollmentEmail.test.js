const test = require("node:test");
const assert = require("node:assert/strict");

const createEnrollmentEmail = require("../templates/enrollmentEmail");

test("Enrollment email contains student and course details", () => {
    const email = createEnrollmentEmail({
        fullName: "Nithin Test",
        email: "test@example.com",
        course: {
            name: "MERN Stack Development",
            code: "MERN101"
        }
    });

    assert.equal(email.subject, "Student Enrollment Confirmation");
    assert.match(email.text, /Nithin Test/);
    assert.match(email.html, /MERN Stack Development/);
});

test("Enrollment email escapes HTML tags", () => {
    const email = createEnrollmentEmail({
        fullName: "<script>alert('test')</script>",
        email: "test@example.com",
        course: {
            name: "MERN Stack Development",
            code: "MERN101"
        }
    });

    assert.doesNotMatch(email.html, /<script>/i);
});