import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Plus, ArrowUp } from "lucide-react";
import "./landingPage.css";

const navItems = [
  { label: "Products", hasDropdown: true },
  { label: "Solutions", hasDropdown: true },
  { label: "Resources", hasDropdown: true },
  { label: "Enterprise", hasDropdown: false },
  { label: "Pricing", hasDropdown: false },
];

export default function ZengptLandingPage() {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Subtle ambient glow, ChatGPT-style */}
      <div className="glow-layer">
        <div className="glow glow-top" />
        <div className="glow glow-bottom" />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo2">ZenGpt</div>

        <div className="nav-links">
          {navItems.map((item) => (
            <button key={item.label} className="nav-item">
              {item.label}
              {item.hasDropdown && <ChevronDown className="chevron-icon" />}
            </button>
          ))}
        </div>

        <button className="nav-item" onClick={() => navigate("/login")}>
          Log in
        </button>

        <button className="signup-btn" onClick={() => navigate("/register")}>
          Sign up
          {/* <span className="signup-arrow">&#8599;</span> */}
        </button>
      </nav>

      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">
          Your AI Companion for Ideas,
          <br />
          Learning, and Productivity
        </h1>

        <p className="hero-subtitle">
          Ask questions, explore ideas, solve problems, and get things done with ZenGPT —
          <br />
          your intelligent AI assistant for everyday tasks.
        </p>

        {/* Prompt box */}
        <div className="prompt-box">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your idea..."
            rows={4}
            className="prompt-textarea"
          />
          <div className="prompt-actions">
            <button type="button" aria-label="Add attachment" className="attach-btn">
              <Plus className="btn-icon" />
            </button>
            <button
              type="button"
              aria-label="Submit prompt"
              disabled={!prompt.trim()}
              className="submit-btn"
            >
              <ArrowUp className="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
