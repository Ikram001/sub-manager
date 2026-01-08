import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  renewalDate: { type: Date, required: true },
});

export default mongoose.model("Subscription", subscriptionSchema);
