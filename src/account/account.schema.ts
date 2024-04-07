import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      maxlength: [50, 'Username cannot exceed 50 characters'],
      autoIndex: true,
    },
    accountNumber: {
      type: String,
      required: [true, 'Account Number is required'],
      unique: true,
      trim: true,
      autoIndex: true,
      validate: {
        validator: function (v: string) {
          return /\d{10}/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid account number!`,
      },
    },
    emailAddress: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      autoIndex: true,
      validate: {
        validator: function (v: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    identityNumber: {
      type: String,
      required: [true, 'Identity Number is required'],
      unique: true,
      autoIndex: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /\d{8,12}/.test(v);
        },
        message: (props) => `${props.value} is not a valid identity number!`,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: 'version', timestamps: true },
);

export const AccountModel = mongoose.model('Account', accountSchema);
