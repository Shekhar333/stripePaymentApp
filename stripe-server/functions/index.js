const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

// Conditionally apply the express.json middleware
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    console.log("webhook");
    next();
  } else {
    console.log("not webhook");
    express.json()(req, res, next);
  }
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    const event = req.body;
    // Extract the object from the event.
    const dataObject = event.data.object;

    // Handle the event
    // Review important events for Billing webhooks
    // https://stripe.com/docs/billing/webhooks
    // Remove comment to see the various objects sent for this sample
    switch (event.type) {
      case "invoice.paid":
        await admin
          .firestore()
          .collection("users")
          .doc(dataObject.customer)
          .update({
            subscriptionId: dataObject.subscription,
            event: event,
            isSubscribed: true,
          });

        break;
      case "invoice.payment_failed":
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        break;
      case "customer.subscription.deleted":
        // if (event.request != null) {
        //     // handle a subscription canceled by your request
        //     // from above.
        // } else {
        //   // handle subscription canceled automatically based
        //   // upon your subscription settings.
        // }
        await admin
          .firestore()
          .collection("users")
          .doc(dataObject.customer)
          .update({
            subscriptionId: null,
            event: event,
            isSubscribed: false,
          });

        break;
      default:
      // Unexpected event type
    }
    res.sendStatus(200);
  }
);

app.post("/cancel-subscription", async (req, res) => {
  // Delete the subscription
  console.log(req.body.subscriptionId);
  const deletedSubscription = await stripe.subscriptions.cancel(
    req.body.subscriptionId
  );
  res.send(deletedSubscription);
});
app.post("/create-subscription", async (req, res) => {
  const { uid, planId } = req.body;
  console.log(uid, planId);
  try {
    // Create the subscription. Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass it to the front end to confirm the payment
    const subscription = await stripe.subscriptions.create({
      customer: uid,
      items: [
        {
          price: planId,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });
    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
});

exports.sks = functions.https.onRequest(app);
exports.handleWebhookEvents = functions.https.onRequest(async (req, res) => {
  let event;

  // Instead of getting the `Stripe.Event`
  // object directly from `req.body`,
  // use the Stripe webhooks API to make sure
  // this webhook call came from a trusted source
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      webhookSecret
    );
  } catch (error) {
    console.log(error);
    res.status(401).send("Webhook Error: Invalid Secret");
    return;
  }
  console.log(event);
  // Extract the object from the event.
  const dataObject = event.data.object;

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  switch (event.type) {
    case "invoice.paid":
      await admin
        .firestore()
        .collection("users")
        .doc(dataObject.customer)
        .update({
          subscriptionId: dataObject.subscription,
          event: event,
          isSubscribed: true,
        });

      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break;
    case "customer.subscription.deleted":
      // if (event.request != null) {
      //     // handle a subscription canceled by your request
      //     // from above.
      // } else {
      //   // handle subscription canceled automatically based
      //   // upon your subscription settings.
      // }
      await admin
        .firestore()
        .collection("users")
        .doc(dataObject.customer)
        .update({
          subscriptionId: null,
          event: event,
          isSubscribed: false,
        });

      break;
    default:
    // Unexpected event type
  }
  res.sendStatus(200);
  // if (relevantEvents.has(event.type)) {
  //   logs.startWebhookEventProcessing(event.id, event.type);
  //   try {
  //     switch (event.type) {
  //       case "product.created":
  //       case "product.updated":
  //         await createProductRecord(event.data.object);
  //         break;
  //       case "price.created":
  //       case "price.updated":
  //         await insertPriceRecord(event.data.object);
  //         break;
  //       case "product.deleted":
  //         await deleteProductOrPrice(event.data.object);
  //         break;
  //       case "price.deleted":
  //         await deleteProductOrPrice(event.data.object);
  //         break;
  //       case "tax_rate.created":
  //       case "tax_rate.updated":
  //         await insertTaxRateRecord(event.data.object);
  //         break;
  //       case "customer.subscription.created":
  //       case "customer.subscription.updated":
  //       case "customer.subscription.deleted":
  //         const subscription = event.data.object;
  //         await manageSubscriptionStatusChange(
  //           subscription.id,
  //           subscription.customer,
  //           event.type === "customer.subscription.created"
  //         );
  //         break;
  //       case "checkout.session.completed":
  //       case "checkout.session.async_payment_succeeded":
  //       case "checkout.session.async_payment_failed":
  //         const checkoutSession = event.data.object;
  //         if (checkoutSession.mode === "subscription") {
  //           const subscriptionId = checkoutSession.subscription;
  //           await manageSubscriptionStatusChange(
  //             subscriptionId,
  //             checkoutSession.customer,
  //             true
  //           );
  //         } else {
  //           const paymentIntentId = checkoutSession.payment_intent;
  //           const paymentIntent = await stripe.paymentIntents.retrieve(
  //             paymentIntentId
  //           );
  //           await insertPaymentRecord(paymentIntent, checkoutSession);
  //         }
  //         if (checkoutSession.tax_id_collection?.enabled) {
  //           const customersSnap = await admin
  //             .firestore()
  //             .collection(config.customersCollectionPath)
  //             .where("stripeId", "==", checkoutSession.customer)
  //             .get();
  //           if (customersSnap.size === 1) {
  //             customersSnap.docs[0].ref.set(checkoutSession.customer_details, {
  //               merge: true,
  //             });
  //           }
  //         }
  //         break;
  //       case "invoice.paid":
  //       case "invoice.payment_succeeded":
  //       case "invoice.payment_failed":
  //       case "invoice.upcoming":
  //       case "invoice.marked_uncollectible":
  //       case "invoice.payment_action_required":
  //         const invoice = event.data.object;
  //         await insertInvoiceRecord(invoice);
  //         break;
  //       case "payment_intent.processing":
  //       case "payment_intent.succeeded":
  //       case "payment_intent.canceled":
  //       case "payment_intent.payment_failed":
  //         const paymentIntent = event.data.object;
  //         await insertPaymentRecord(paymentIntent);
  //         break;
  //       default:
  //         logs.webhookHandlerError(
  //           new Error("Unhandled relevant event!"),
  //           event.id,
  //           event.type
  //         );
  //     }

  //     if (eventChannel) {
  //       await eventChannel.publish({
  //         type: `com.stripe.v1.${event.type}`,
  //         data: event.data.object,
  //       });
  //     }

  //     console.log(event.id, event.type);
  //   } catch (error) {
  //     console.log(error);
  //     return;
  //   }
  // }

  // Return a response to Stripe to acknowledge receipt of the event.
  // resp.json({ received: true });
});
exports.createCustomerInUserDBandStripe = functions.auth
  .user()
  .onCreate(async (user) => {
    const uid = user.uid;
    const email = user.email;
    const isSubscribed = false;
    const response = await stripe.customers.create({ email: email, id: uid });
    const data = { uid, email, isSubscribed, stripe: response };
    admin.firestore().collection("users").doc(uid).set(data);
    console.log(uid);
    console.log(response);
    return true;
  });
