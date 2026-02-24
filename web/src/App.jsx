import { useState } from "react";
import * as api from "./services/api-service";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);

  const handle = (label, promise) => {
    setResult({ label, data: "Loading..." });
    promise
      .then((data) => setResult({ label, data }))
      .catch((err) =>
        setResult({ label, data: err.response?.data || err.message }),
      );
  };

  return (
    <>
      <h1>Iron Projects API Tester</h1>

      <section>
        <h2>Auth</h2>
        <button
          onClick={() =>
            handle(
              "Register",
              api.register({
                inviteCode: "abc",
                email: "test@example.com",
                password: "s3cret",
                name: "Test User",
              }),
            )
          }
        >
          Register
        </button>
        <button
          onClick={() =>
            handle("Login", api.login("test@example.com", "s3cret"))
          }
        >
          Login
        </button>
        <button onClick={() => handle("Logout", api.logout())}>Logout</button>
      </section>

      <section>
        <h2>Users</h2>
        <button onClick={() => handle("Get Profile", api.getProfile())}>
          Get Profile
        </button>
        <button
          onClick={() =>
            handle(
              "Update Profile",
              api.updateProfile({ name: "Updated Name", bio: "Updated bio" }),
            )
          }
        >
          Update Profile
        </button>
        <button
          onClick={() => handle("Get User", api.getUser(prompt("User ID:")))}
        >
          Get User
        </button>
      </section>

      <section>
        <h2>Projects</h2>
        <button
          onClick={() =>
            handle(
              "Create Project",
              api.createProject({
                title: "Test Project",
                description: "A test project",
                module: 2,
              }),
            )
          }
        >
          Create Project
        </button>
        <button onClick={() => handle("List Projects", api.listProjects())}>
          List Projects
        </button>
        <button
          onClick={() =>
            handle("List Projects (filtered)", api.listProjects({ module: 2 }))
          }
        >
          List Projects (module 2)
        </button>
        <button
          onClick={() =>
            handle("Get Project", api.getProject(prompt("Project ID:")))
          }
        >
          Get Project
        </button>
        <button
          onClick={() =>
            handle(
              "Update Project",
              api.updateProject(prompt("Project ID:"), {
                title: "Updated Title",
              }),
            )
          }
        >
          Update Project
        </button>
        <button
          onClick={() =>
            handle("Delete Project", api.deleteProject(prompt("Project ID:")))
          }
        >
          Delete Project
        </button>
      </section>

      <section>
        <h2>Reviews</h2>
        <button
          onClick={() =>
            handle(
              "Create Review",
              api.createReview(prompt("Project ID:"), {
                comment: "Great project!",
                rating: 5,
              }),
            )
          }
        >
          Create Review
        </button>
        <button
          onClick={() =>
            handle(
              "Delete Review",
              api.deleteReview(prompt("Project ID:"), prompt("Review ID:")),
            )
          }
        >
          Delete Review
        </button>
      </section>

      <section>
        <h2>Messages</h2>
        <button
          onClick={() =>
            handle(
              "Send Message",
              api.sendMessage(prompt("Recipient User ID:"), {
                subject: "Hello",
                body: "Test message",
              }),
            )
          }
        >
          Send Message
        </button>
        <button
          onClick={() =>
            handle(
              "Delete Message",
              api.deleteMessage(prompt("User ID:"), prompt("Message ID:")),
            )
          }
        >
          Delete Message
        </button>
      </section>

      {result && (
        <section>
          <h2>Result: {result.label}</h2>
          <pre>
            {typeof result.data === "string"
              ? result.data
              : JSON.stringify(result.data, null, 2)}
          </pre>
        </section>
      )}
    </>
  );
}

export default App;
