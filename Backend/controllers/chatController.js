const { searchProducts } = require("../services/chatService");

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        status: "failed",
        message: "Message is required",
      });
    }

    const result = await searchProducts(message.trim());

    let reply;

    if (result.products.length === 0) {
      reply =
        "🤔 مش لاقي منتجات مناسبة لطلبك. " +
        "جرب تكتب نوع المنتج أو البراند أو الميزانية.";
    } else {
      reply = `🔎 لقيتلك ${result.products.length} منتجات مناسبة لطلبك.`;
    }

    res.status(200).json({
      status: "success",
      reply,
      filters: result.filters,
      products: result.products,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  chat,
};
