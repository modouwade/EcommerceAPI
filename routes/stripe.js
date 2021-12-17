const router = require("express").Router();
// const KEY = process.env.STRIPE_KEY;
const stripe = require("stripe")(
  "sk_test_51K6eqKIQw5SQ1kyY0eSCVJmJxmtZa4t8TN4wzTPGZLyWiOhyWdDCBZYsvoRfcsESiHxtF5m9plj4bbWEgC5QmjV700kcSjm5Vd"
);

router.post("/payment", async (req, res) => {
  await stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
