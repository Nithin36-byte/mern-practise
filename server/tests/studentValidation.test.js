
const {
    studentCreateSchema,
    studentUpdateSchema,
    idParamsSchema,
    roleSchema
} = require("../validators/studentValidation");

describe("Student Validation Tests", () => {

    test("should accept valid student details", () => {
        const student = {
            fullName: "Nithin Kumar",
            email: "NITHIN@example.com",
            mobile: "9876543210",
            gender: "Male",
            course: "507f1f77bcf86cd799439011",
            address: "Hyderabad"
        };

        const result = studentCreateSchema.safeParse(student);

        expect(result.success).toBe(true);
        expect(result.data.email).toBe("nithin@example.com");
    });

    test("should reject an invalid email", () => {
        const student = {
            fullName: "Nithin Kumar",
            email: "wrong-email",
            mobile: "9876543210",
            gender: "Male",
            address: "Hyderabad"
        };

        const result = studentCreateSchema.safeParse(student);

        expect(result.success).toBe(false);
    });

    test("should reject a short student name", () => {
        const student = {
            fullName: "A",
            email: "test@example.com",
            mobile: "9876543210",
            gender: "Male",
            address: "Hyderabad"
        };

        const result = studentCreateSchema.safeParse(student);

        expect(result.success).toBe(false);
    });

    test("should reject an invalid mobile number", () => {
        const student = {
            fullName: "Nithin Kumar",
            email: "test@example.com",
            mobile: "12345",
            gender: "Male",
            address: "Hyderabad"
        };

        const result = studentCreateSchema.safeParse(student);

        expect(result.success).toBe(false);
    });

    test("should reject an invalid gender", () => {
        const student = {
            fullName: "Nithin Kumar",
            email: "test@example.com",
            mobile: "9876543210",
            gender: "Unknown",
            address: "Hyderabad"
        };

        const result = studentCreateSchema.safeParse(student);

        expect(result.success).toBe(false);
    });

    test("should reject additional unexpected fields", () => {
        const student = {
            fullName: "Nithin Kumar",
            email: "test@example.com",
            mobile: "9876543210",
            gender: "Male",
            address: "Hyderabad",
            role: "Admin"
        };

        const result = studentCreateSchema.safeParse(student);

        expect(result.success).toBe(false);
    });

    test("should convert empty course value to null", () => {
        const student = {
            fullName: "Nithin Kumar",
            email: "test@example.com",
            mobile: "9876543210",
            gender: "Male",
            course: "",
            address: "Hyderabad"
        };

        const result = studentCreateSchema.safeParse(student);

        expect(result.success).toBe(true);
        expect(result.data.course).toBeNull();
    });

    test("should reject an invalid MongoDB ID", () => {
        const result = idParamsSchema.safeParse({
            id: "12345"
        });

        expect(result.success).toBe(false);
    });

    test("should accept a valid MongoDB ID", () => {
        const result = idParamsSchema.safeParse({
            id: "507f1f77bcf86cd799439011"
        });

        expect(result.success).toBe(true);
    });

    test("should reject an empty student update", () => {
        const result = studentUpdateSchema.safeParse({});

        expect(result.success).toBe(false);
    });

    test("should accept a valid application role", () => {
        const result = roleSchema.safeParse("Admin");

        expect(result.success).toBe(true);
    });

    test("should reject an invalid application role", () => {
        const result = roleSchema.safeParse("SuperAdmin");

        expect(result.success).toBe(false);
    });

});
