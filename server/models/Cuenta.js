import mongoose from "mongoose";

const cuentaSchema = new mongoose.Schema(
  {
    numeroCuenta: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    titular: {
      type: String,
      required: true,
      trim: true
    },
    saldo: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Cuenta", cuentaSchema);
