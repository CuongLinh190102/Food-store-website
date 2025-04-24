import React from "react";
import { FaSearch, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import "./how-it-work.css";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Choose Your Food",
      description: "Browse through hundreds of restaurants and dishes",
      icon: <FaSearch className="step-icon" />,
    },
    {
      id: 2,
      title: "Delivery Address",
      description: "Select your delivery location and payment method",
      icon: <FaMapMarkerAlt className="step-icon" />,
    },
    {
      id: 3,
      title: "Fast Delivery",
      description: "Your food will be delivered in less than 30 minutes",
      icon: <FaClock className="step-icon" />,
    },
  ];

  return (
    <section className="how-it-works">
      <div className="section-title">
        <h2>How It Works</h2>
        <p>Order your favorite food in just 3 simple steps</p>
      </div>

      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <div className="icon-wrapper">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;