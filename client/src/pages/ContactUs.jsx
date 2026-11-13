
import Button from "../components/Button";

function ContactUs() {
  function handleContact() {
    alert("Thank you for contacting us!");
  }

  return (
    <div className="page">
      <h1>Contact Us</h1>

      <p>Email: support@studentportal.com</p>
      <p>Phone: 9876543210</p>

      <Button
        text="Contact Support"
        onClick={handleContact}
      />
    </div>
  );
}

export default ContactUs;
