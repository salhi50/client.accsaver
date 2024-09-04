import Container from "@/components/Container";
import Logo from "@/components/Logo";
import { metadata } from "./layout";
import "./home.css";

export default function HomePage() {
  return (
    <Container>
      <a href="/" aria-label="Homepage">
        <Logo />
      </a>
      <h1 className="heading">{metadata.description}</h1>
      <div className="flex flex-wrap">
        <a href="/login" className="login-btn">
          Login
        </a>
        <a href="/signup" className="register-btn">
          Create an account
        </a>
      </div>
    </Container>
  );
}
