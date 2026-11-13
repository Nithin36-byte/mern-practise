
const validateRequest = (schema, location = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[location]);

        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Replace only the request body with validated and normalized data.
        if (location === "body") {
            req.body = result.data;
        }

        next();
    };
};

module.exports = validateRequest;
