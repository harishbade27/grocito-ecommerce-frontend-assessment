export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { items, total } = req.body || {};

  if (!Array.isArray(items) || typeof total !== "number") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid request payload" });
  }

  const isSuccess = Math.random() > 0.2;

  if (!isSuccess) {
    return res
      .status(500)
      .json({ success: false, message: "Payment gateway error" });
  }

  return res.status(200).json({
    success: true,
    message: "Order created successfully",
    orderId: Math.floor(Math.random() * 1000000),
  });
}
