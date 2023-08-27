import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import Container from "./Container";
import { useNavigate } from "react-router-dom";

export default function CheckoutForm({ plan, monthly, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const cardRef = React.useRef(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    // stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
    //   switch (paymentIntent.status) {
    //     case "succeeded":
    //       setMessage("Payment succeeded!");
    //       break;
    //     case "processing":
    //       setMessage("Your payment is processing.");
    //       break;
    //     case "requires_payment_method":
    //       setMessage("Your payment was not successful, please try again.");
    //       break;
    //     default:
    //       setMessage("Something went wrong.");
    //       break;
    //   }
    // });
  }, [stripe]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const currentUrl = window.location.href;
  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    // console.log(elements);
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      //`Elements` instance that was used to create the Payment Element
      // elements,
      payment_method: {
        card: elements.getElement(CardElement),
      },
      return_url: currentUrl + "/home",
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      navigate("/home");
    }
  };
  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <Container className="bg-[#204c94] flex justify-center items-center">
      <div className="flex ">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col p-9 py-10 bg-white  min-w-[400px] gap-6 rounded-s-lg">
            <div className="flex flex-col gap-2">
              <h1 className="text-left text-2xl font-semibold">
                Complete Payment
              </h1>
              <p className="text-left text-sm text-gray-500">
                Enter your credit card or debit card details below
              </p>
            </div>
            <div className="border border-grey-200 px-2 py-3 rounded-md">
              <CardElement />
            </div>
            <button
              disabled={isLoading || !stripe || !elements}
              className="bg-[#204c94] p-2 text-white rounded-md w-[150px]"
              type="submit"
            >
              Confirm Payment
            </button>
          </div>
        </form>
        <div className="flex flex-col p-9 py-10 bg-gray-100 rounded-e-lg min-w-[300px] justify-between [&>div>p]:font-semibold [&>div>p]:text-xs">
          <p className=" text-gray-600 font-semibold text-xl mb-8">
            Order Summary
          </p>
          <div className="flex ">
            <p>Plan Name</p>
            <p className="ml-auto">{plan.name}</p>
          </div>
          <hr />
          <div className="flex ">
            <p>Billing Cycle</p>
            <p className="ml-auto">{monthly ? "Monthly" : "Yearly"}</p>
          </div>
          <hr />
          <div className="flex ">
            <p>Plan price</p>
            <p className="ml-auto">
              ₹{" "}
              {monthly ? plan.price.monthly + "/mo" : plan.price.yearly + "/yr"}
            </p>
          </div>
          <hr className="mb-6" />
        </div>
      </div>
      {message && (
        <div className="absolute bg-red-400 p-2 bottom-4 left-3 flex ">
          <p className="text-white">{message}</p>
          <button
            className="text-white"
            onClick={() => {
              setMessage(null);
            }}
          >
            x
          </button>
        </div>
      )}
    </Container>
  );
}
