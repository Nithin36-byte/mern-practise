
import Card from "../components/Card";

function Home() {
  return (
    <div className="page">
      <h1>Welcome to Student Portal</h1>
      <p>Manage your student information in one place.</p>

      <div className="card-container">
        <Card
          title="Student Management"
          description="Manage student information easily."
        />

        <Card
          title="Easy Navigation"
          description="Move between different pages."
        />

        <Card
          title="Student Services"
          description="Explore the services we provide."
        />
      </div>
    </div>
  );
}

export default Home;
