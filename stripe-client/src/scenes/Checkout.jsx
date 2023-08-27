import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Navigate, useLocation } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import { plans } from "../constants";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function Checkout({ user }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const plan = plans[queryParams.get("plan")];
  const monthly = queryParams.get("monthly") === "true";
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (!user || !plan) return;
    const planId = monthly ? plan.stripe_id.monthly : plan.stripe_id.yearly;
    const data = {
      uid: user.uid,
      planId,
    };
    fetch(process.env.REACT_APP_REQ_URL + "/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setClientSecret(data.clientSecret);
      });
  }, []);

  if (!user || !plan) return <Navigate to="/" />;
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            plan={plan}
            monthly={monthly}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </>
  );
}
