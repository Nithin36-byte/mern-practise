
const express = require("express");
const request = require("supertest");
const { z } = require("zod");

const validateRequest = require("../middleware/validateRequest");

describe("Request Validation Middleware Tests", () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());

        const studentSchema = z.object({
            fullName: z.string().min(2),
            email: z.string().email()
        });

        app.post(
            "/students",
            validateRequest(studentSchema),
            (req, res) => {
                res.status(201).json({
                    success: true,
                    student: req.body
                });
            }
        );
    });

    test("should accept valid student data", async () => {
        const response = await request(app)
            .post("/students")
            .send({
                fullName: "Nithin Kumar",
                email: "nithin@example.com"
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });

    test("should reject invalid student data", async () => {
        const response = await request(app)
            .post("/students")
            .send({
                fullName: "N",
                email: "wrong-email"
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors.length).toBeGreaterThan(0);
    });

    test("should reject an empty request body", async () => {
        const response = await request(app)
            .post("/students")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});
