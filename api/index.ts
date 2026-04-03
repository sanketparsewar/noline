import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const app = express();

app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.json({
    status: "ok",
    mode: isProd ? "production" : "development",
    env: {
      hasTestKeyId: !!process.env.VITE_RAZORPAY_KEY_ID_TEST,
      hasTestKeySecret: !!process.env.RAZORPAY_KEY_SECRET_TEST,
      hasLiveKeyId: !!process.env.VITE_RAZORPAY_KEY_ID_LIVE,
      hasLiveKeySecret: !!process.env.RAZORPAY_KEY_SECRET_LIVE,
    },
  });
});

const getRazorpay = () => {
  const isProd = process.env.NODE_ENV === "production";
  const key_id = isProd
    ? process.env.VITE_RAZORPAY_KEY_ID_LIVE
    : process.env.VITE_RAZORPAY_KEY_ID_TEST;
  const key_secret = isProd
    ? process.env.RAZORPAY_KEY_SECRET_LIVE
    : process.env.RAZORPAY_KEY_SECRET_TEST;

  if (!key_id || !key_secret) {
    const mode = isProd ? "LIVE" : "TEST";
    throw new Error(
      `Razorpay ${mode} Key ID or Key Secret is missing in environment variables.`,
    );
  }

  return new Razorpay({
    key_id,
    key_secret,
  });
};

// API Route to create a Razorpay order
app.post("/api/razorpay/order", async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const { amount, currency } = req.body;
    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: currency,
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      error: "Failed to create order",
      message: error.message,
      details: error.description || error.error?.description || "Unknown error",
    });
  }
});

// API Route to verify Razorpay payment
app.post("/api/razorpay/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const isProd = process.env.NODE_ENV === "production";
    const secret = isProd
      ? process.env.RAZORPAY_KEY_SECRET_LIVE
      : process.env.RAZORPAY_KEY_SECRET_TEST;

    if (!secret) {
      const mode = isProd ? "LIVE" : "TEST";
      throw new Error(`RAZORPAY_KEY_SECRET_${mode} is missing.`);
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({ status: "ok" });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error: any) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({
      error: "Failed to verify payment",
      message: error.message,
    });
  }
});

export default app;
