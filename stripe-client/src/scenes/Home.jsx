import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../auth";
import { plans } from "../constants";
import dayjs from "dayjs";
import { LoadingSpinner } from "../components/Loading";

const formatDate = (timestamp) => {
  return dayjs.unix(timestamp).format("MMM D, YYYY");
};

function Home({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptionId, setSubscriptionId] = useState("");
  const [priceId, setPriceId] = useState("");
  const [active, setActive] = useState(false);
  const [plan, setPlan] = useState(null);
  const [isMonthly, setIsMonthly] = useState(false);
  const [period, setPeriod] = useState(null);
  const [canceledAt, setCanceledAt] = useState(null);
  useEffect(() => {
    if (!priceId || priceId === "") return;
    const index = plans.findIndex((plan) => {
      if (
        priceId === plan.stripe_id.monthly ||
        priceId === plan.stripe_id.yearly
      ) {
        setPlan(plan);
        priceId === plan.stripe_id.monthly
          ? setIsMonthly(true)
          : setIsMonthly(false);
        return true;
      } else {
        return false;
      }
    });
    // console.log(index);
  }, [priceId]);

  const addAutoUpdate = (user) => {
    const uid = user.uid;
    const docRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(
      docRef,

      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const subscriptionId = data.subscriptionId;
          const priceId =
            data?.event?.data?.object?.plan?.id ||
            data?.event?.data?.object?.lines?.data[0]?.plan?.id;
          const active =
            data?.event?.data?.object?.lines?.data[0]?.plan?.active;
          const period = data?.event?.data?.object?.lines?.data[0]?.period;
          setPeriod(period);
          setSubscriptionId(subscriptionId);
          setPriceId(priceId);
          setActive(active);
          //   console.log(data?.event);
          const canceledAt = data?.event?.data?.object?.current_period_end;
          setCanceledAt(canceledAt);
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        }
        setLoading(false);
      },
      (err) => {
        console.log("err");
        console.log(err.message);
      }
    );

    return unsubscribe;
  };
  useEffect(() => {
    if (!user) {
      return;
    }
    if (user !== null) {
      const unsubscribe = addAutoUpdate(user);

      return () => unsubscribe(); //cleanup
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/" />;
  }
  const cancelSubscription = () => {
    const url = process.env.REACT_APP_REQ_URL + "/cancel-subscription";
    const data = {
      uid: user.uid,
      subscriptionId: subscriptionId,
    };
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <Container className="bg-[#204c94] flex justify-center items-center">
      <div className="flex flex-col p-4 py-3 bg-white min-w-[460px]  max-w-[470px] rounded-xl gap-4">
        <div className="flex justify-between">
          <p className=" font-semibold">
            Current Plan Details{" "}
            {plan && (
              <span
                className={`ml-2 px-2 pb-[0.15rem] rounded-md text-[0.75rem]  ${
                  active ? "bg-[#C2DCFC]" : " bg-red-100/40"
                } ${active ? " text-[#3B6EB5]  " : " text-red-500"}`}
              >
                {active ? "Active" : "Cancelled"}
              </span>
            )}
          </p>
          {active && (
            <button
              className=" text-[#3B6EB5] text-sm font-semibold"
              onClick={cancelSubscription}
            >
              {plan ? "Cancel" : <LoadingSpinner />}
            </button>
          )}
        </div>
        <div className="flex flex-col">
          {plan ? (
            <p className="font-semibold text-md">{plan?.name} </p>
          ) : (
            <div className="w-20 h-8 animate-pulse bg-[#1E4D91]/30 rounded-sm"></div>
          )}
          <p className="text-sm text-gray-500">
            {plan?.devices.map((device, _) => (_ ? " + " : "") + device)}
          </p>
          {!plan && (
            <div className=" w-44 h-4 animate-pulse mt-2 bg-[#1E4D91]/30 rounded-sm"></div>
          )}
        </div>
        <h1 className="text-3xl font-bold">
          {plan
            ? `₹ ${isMonthly ? plan?.price.monthly : plan?.price.yearly}`
            : "₹ 00"}
          <span className=" text-2xl font-normal">
            {isMonthly ? "/mo" : "/yr"}
          </span>
        </h1>
        <button
          className="text-[#3B6EB5] text-sm font-semibold border border-[#3B6EB5] max-w-max px-3 rounded-md py-1"
          onClick={() => navigate("/plans")}
        >
          {!plan && <LoadingSpinner />}
          {plan && (active ? "Change Plan" : "Choose Plan")}
        </button>
        {period?.start || canceledAt ? (
          <>
            {active ? (
              <p className=" bg-gray-100 p-1 text-xs rounded-sm ">
                Your subscription has started on{" "}
                <span className="font-semibold">
                  {formatDate(period?.start)}
                </span>{" "}
                and will auto renew on{" "}
                <span className="font-semibold">{formatDate(period?.end)}</span>
                .
              </p>
            ) : (
              <p className=" bg-gray-100 p-1 text-xs rounded-sm ">
                Your subscription was cancelled and you will lose access to the
                service on{" "}
                <span className="font-semibold">{formatDate(canceledAt)}</span>.
              </p>
            )}
          </>
        ) : (
          <div className="w-full h-8 animate-pulse bg-[#1E4D91]/30 rounded-sm"></div>
        )}
      </div>
    </Container>
  );
}

export default Home;
