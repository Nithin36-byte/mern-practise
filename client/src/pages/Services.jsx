
import Card from "../components/Card";

function Services() {
  return (
    <div className="page">
      <h1>Our Services</h1>

      <div className="card-container">
        <Card
          title="Student Registration"
          description="Register new student information."
        />

        <Card
          title="Student Records"
          description="View and manage student records."
        />

        <Card
          title="Student Support"
          description="Get assistance with student services."
        />
      </div>
    </div>
  );
}

export default Services;
