const Order = require("../models/Order");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndIsAdmin,
  verifyToken,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const NewOrder = new Order(req.body);
  try {
    const saveOrder = await NewOrder.save();
    res.status(200).json(saveOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update
router.put("/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //DELETE
router.delete("/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER Order
router.get("/find/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const getOrder = await Order.find({ userId: req.params.id });
    res.status(200).json(getOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL
router.get("/", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const getAllOrder = await Order.find();
    res.status(200).json(getAllOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndIsAdmin, async (req, res) => {
  const date = new Date();
  lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
