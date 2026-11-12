
jest.mock("../models/Student", () => ({
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
}));

jest.mock("../models/Course", () => ({
    findById: jest.fn()
}));

const Student = require("../models/Student");
const Course = require("../models/Course");

const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

describe("Student Controller Tests", () => {
    let req;
    let res;
    let next;

    const studentData = {
        fullName: "Nithin Kumar",
        email: "nithin@example.com",
        mobile: "9876543210",
        gender: "Male",
        course: "507f1f77bcf86cd799439011",
        address: "Hyderabad"
    };

    const savedStudent = {
        _id: "507f1f77bcf86cd799439012",
        ...studentData
    };

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: { ...studentData },
            params: { id: savedStudent._id },
            query: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    test("should create a student successfully", async () => {
        Course.findById.mockResolvedValue({ _id: studentData.course });
        Student.create.mockResolvedValue(savedStudent);

        await createStudent(req, res, next);

        expect(Course.findById).toHaveBeenCalledWith(studentData.course);
        expect(Student.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json.mock.calls[0][0].success).toBe(true);
    });

    test("should reject student creation when required fields are missing", async () => {
        req.body.email = "";

        await createStudent(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(Student.create).not.toHaveBeenCalled();
    });

    test("should return students successfully", async () => {
        const students = [savedStudent];

        const query = {
            populate: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockResolvedValue(students)
        };

        Student.find.mockReturnValue(query);
        Student.countDocuments.mockResolvedValue(1);

        await getStudents(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json.mock.calls[0][0].data).toEqual(students);
        expect(res.json.mock.calls[0][0].total).toBe(1);
    });

    test("should reject an invalid pagination limit", async () => {
        req.query.limit = "20";

        await getStudents(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json.mock.calls[0][0].message).toBe(
            "Limit must be 10, 25 or 50"
        );
    });

    test("should return a student by ID", async () => {
        Student.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(savedStudent)
        });

        await getStudentById(req, res, next);

        expect(Student.findById).toHaveBeenCalledWith(savedStudent._id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json.mock.calls[0][0].data).toEqual(savedStudent);
    });

    test("should return 404 when a student is not found", async () => {
        Student.findById.mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
        });

        await getStudentById(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json.mock.calls[0][0].message).toBe("Student not found");
    });

    test("should update a student successfully", async () => {
        const updatedStudent = {
            ...savedStudent,
            fullName: "Nithin Updated"
        };

        Student.findByIdAndUpdate.mockReturnValue({
            populate: jest.fn().mockResolvedValue(updatedStudent)
        });

        req.body = { fullName: "Nithin Updated" };

        await updateStudent(req, res, next);

        expect(Student.findByIdAndUpdate).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json.mock.calls[0][0].success).toBe(true);
    });

    test("should delete a student successfully", async () => {
        Student.findByIdAndDelete.mockResolvedValue(savedStudent);

        await deleteStudent(req, res, next);

        expect(Student.findByIdAndDelete).toHaveBeenCalledWith(savedStudent._id);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json.mock.calls[0][0].success).toBe(true);
    });

    test("should return 404 when deleting a student that does not exist", async () => {
        Student.findByIdAndDelete.mockResolvedValue(null);

        await deleteStudent(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json.mock.calls[0][0].message).toBe("Student not found");
    });
});
