const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    profile_views: { type: Number, required: true },
    search_views: { type: Number, required: true },
    website_clicks: { type: Number, required: true },
    phone_calls: { type: Number, required: true },
    direction_requests: { type: Number, required: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Insight', insightSchema);
