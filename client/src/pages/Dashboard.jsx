import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/dashboardService";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";
import "./Dashboard.css";

function SummaryCard({ title, value }) {
    return (
        <div className="summary-card">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
}

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [days, setDays] = useState("30");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboardStats(days);
                setDashboard(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [days]);

    if (loading) {
        return <div className="dashboard-container">Loading dashboard...</div>;
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <h2>Dashboard</h2>
                <p className="dashboard-error">{error}</p>
                <button onClick={() => setDays(days)}>Retry</button>
            </div>
        );
    }

    if (!dashboard) {
        return <div className="dashboard-container">No dashboard data available.</div>;
    }

    const {
        totalStudents,
        activeCourses,
        totalInstructors,
        recentStudents,
        enrollmentStatus,
        courseDistribution
    } = dashboard;

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">
                <div>
                    <h2>Student Portal Dashboard</h2>
                    <p>Overview of students, courses and enrollments</p>
                </div>

                <div className="dashboard-filter">
                    <label htmlFor="dateFilter">Report period: </label>
                    <select
                        id="dateFilter"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last 365 days</option>
                        <option value="all">All time</option>
                    </select>
                </div>
            </div>

            <div className="summary-grid">
                <SummaryCard
                    title="Total Registered Students"
                    value={totalStudents}
                />

                <SummaryCard
                    title="Active Courses"
                    value={activeCourses}
                />

                <SummaryCard
                    title="Total Instructors"
                    value={totalInstructors}
                />
            </div>

            <section className="dashboard-section">
                <h3>Course-wise Student Distribution</h3>

                {courseDistribution.length === 0 ? (
                    <p>No course enrollment data available for this period.</p>
                ) : (
                    <div className="dashboard-chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={courseDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="courseName" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="studentCount"
                                    name="Students"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h3>Students by Enrollment Status</h3>

                {enrollmentStatus.length === 0 ? (
                    <p>No enrollment status data available.</p>
                ) : (
                    <div className="status-grid">
                        {enrollmentStatus.map((item) => (
                            <div className="status-card" key={item.status}>
                                <span>{item.status}</span>
                                <strong>{item.count}</strong>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <h3>Recent Enrollment Activity</h3>

                {recentStudents.length === 0 ? (
                    <p>No recent student registrations found for this period.</p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Registered Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentStudents.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.fullName}</td>
                                        <td>{student.email}</td>
                                        <td>
                                            {student.course?.name || "Unassigned"}
                                        </td>
                                        <td>
                                            {student.enrollmentStatus || "Enrolled"}
                                        </td>
                                        <td>
                                            {student.createdAt
                                                ? new Date(
                                                    student.createdAt
                                                ).toLocaleDateString()
                                                : "Not available"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

        </div>
    );
}

export default Dashboard;