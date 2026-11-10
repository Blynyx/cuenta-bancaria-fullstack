import mongoose from "mongoose";

const transaccionSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      enum: ["deposito", "retiro", "transferencia"],
      required: true
    },
    monto: {
      type: Number,
      required: true,
      min: 0.01
    },
    cuentaOrigen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cuenta",
      default: null
    },
    cuentaDestino: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cuenta",
      default: null
    },
    fecha: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

transaccionSchema.index({ cuentaOrigen: 1, fecha: -1 });
transaccionSchema.index({ cuentaDestino: 1, fecha: -1 });

export default mongoose.model("Transaccion", transaccionSchema);
