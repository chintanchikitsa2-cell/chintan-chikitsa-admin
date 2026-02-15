import { Schema, model, models } from "mongoose";

const EventRegistrationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    phone: {
      type: String,
      required: true,
      minlength: 8,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EventRegistration =
  models.EventRegistration ||
  model("EventRegistration", EventRegistrationSchema);
