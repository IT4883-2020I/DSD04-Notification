const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Comments schema that has reference to Post and user schemas
 */
const subscriptionSchema = Schema({
  project_type: {
    type: Schema.Types.String,
    required: true,
    default: null
  },
  userId: {
    type: Schema.Types.String,
    // required: true,
    default: null
  },
  subscription: {
    type: Schema.Types.Mixed,
    default: null
  },
  hash: {
    type: Schema.Types.String
  },
  created: {
    type: Schema.Types.Date,
    default: Date.now(),
  },
});

module.exports = Subscription = mongoose.model("subscriptions", subscriptionSchema);
