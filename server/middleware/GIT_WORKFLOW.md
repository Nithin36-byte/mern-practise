
# Git and GitHub Workflow

## Project
Student Management System

## Technology
- MongoDB
- Express.js
- React.js
- Node.js
- Git and GitHub

## Project Structure
- client: React frontend
- server: Express backend
- docs: Project documentation

## Branching Strategy
The master branch contains the stable project.
Feature branches are used for individual features and updates.

Example branches:
- feature/student-crud
- feature/student-search
- feature/user-authentication
- feature/course-management
- feature/student-dashboard
- feature/file-uploads
- test/automated-tests

## Commit Messages
Use meaningful commit messages that describe the changes.

Examples:
- Add student registration
- Update student search
- Fix authentication validation
- Add dashboard tests

## Pull Request Process
1. Create a feature branch.
2. Make the required changes.
3. Test the changes.
4. Commit the changes.
5. Push the feature branch to GitHub.
6. Create a Pull Request.
7. Review and address comments.
8. Merge after approval.

## Security
- Do not commit .env files.
- Do not upload passwords or API keys.
- Do not upload real student personal information.
- Keep node_modules and generated build files out of Git.

## Testing
Run backend tests using npm test.
Run frontend build using npm run build.

## Review
Every Pull Request should include:
- Summary of changes
- Important files changed
- Testing steps and results
- Screenshots where relevant
- Known issues or limitations
