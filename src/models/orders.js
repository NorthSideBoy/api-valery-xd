import mongoose from "mongoose";
import moment from "moment";

const StatusEnum = [
  "preorder_pending",
  "confirmado",
  "verificado",
  "completado",
  "cancelado",
  "rechazado",
  "preorder_expired",
];
const StatusPedido = [
  "",
  "Pendiente",
  "Disponible",
  "Reintegrado",
  "Entregado",
  "Asignado",
  "Transito",
  "Cancelado",
  "Disputa",
  "Completado",
];

const calificationSchema = new mongoose.Schema({
  suggests: {
    type: String,
    default: "",
  },
  rateStore: {
    type: Number,
    required: true,
    default: 0,
  }, 
  rateDelivery: {
    type: Number,
    required: false,
    default: 0,
  } 
}, {_id: false})

const HistoryOrderStatusSchema = new mongoose.Schema({
  datetime: {
    type: Date,
    index: true,
    required: true
  },
  value: {
    type: String,
    enum: StatusEnum,
    required: true
  },  
}, {_id: false})

const HistoryPedidoStatusSchema = new mongoose.Schema({
  datetime: {
    type: Date,
    index: true,
    required: true
  },
  value: {
    type: String,
    enum: StatusPedido,
    required: true
  },  
}, {_id: false})

const addressesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  ref: {
    type: String,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
})
const notificationsTypes = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  status: {
    type: Boolean,
  }
},{
  _id: false
})
const notificationsEmail = new mongoose.Schema({
  email: {
      type: String,
      //default: ""
  },
  types: {
      type: [notificationsTypes],
      //default: []
  }
}, {
  _id: false
})
const StoresSchema = new mongoose.Schema({
  id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
  },
  name: {
      type: String,
      required: true,
  },
  profileImage: {
    type: String,
    default: "",
  },
  notificationsEmail: {
    type: [notificationsEmail],
    default: {},
  },
  address: {
    type: [addressesSchema],
    default: {}
  },
  phone: {
    type: String,
    required: true,
  },
})
const DeliverySchema = new mongoose.Schema({
  id: {
      type: mongoose.Schema.Types.ObjectId,
  },
  name: {
      type: String,
      default:"",
  },
  profileImage: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: ""
},
})

const pedidoSchema = new mongoose.Schema({
  pedidoNumber: {
    type: String,
    default: ""
  },
  calification: {
    type: calificationSchema,
    default: {}
  },
  store:{
    type: StoresSchema,
    default: {}
  },
  delivery:{
    type: DeliverySchema,
    default: {}
  },
  products: {
    type: [mongoose.Schema.Types.Mixed]
  },
  totalProductos: {
    type: Number,
    required: true,
    default: 0,
  },
  envioPrice: {
    type: Number,
    required: true,
  },
  envioType: {
    type: String,
    required: true,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  fee: {
    type: Number,
    required: true,
    default: 0,
  },
  /* status: {
    type: String,
    enum: StatusPedido,
    default: "",
  }, */
  status: {
    value: {
      type: String,
      enum: StatusPedido,
      default: "",
    },
    history: [HistoryPedidoStatusSchema],
  },
  reasonReject: {
    type: String,
  },
  direccion: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    index: true,
  },
  updatedAt: {
    type: Date,
    index: true,
  },
  note:{
    type: String,
    default: ""
  }
},{ timestamps: true },
{
  _id: true
},
)
const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    referencia: {
      type: String,
    },
    paymentMethod: {
      type: [mongoose.Schema.Types.Mixed],
      required: true,
    },
    refTranf: {
      type: String,
      required: false,
    },
    comprobante: {
      type: String,
      required: false,
      default: "",
    },
    orderNumber: {
      type: Number,
      required: true,
    },
    user: {
      type: [mongoose.Schema.Types.Mixed],
    },
    pedido: {
      type: [pedidoSchema]
    },
    reasonReject: {
      type: String,
    },
    /* status: {
      type: String,
      required: false,
      enum: StatusEnum
    }, */
    status: {
      value: {
        type: String,
        required: true,
        enum: StatusEnum
      },
      history: [HistoryOrderStatusSchema],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    priceInCoin: {
      type: String,
      required: true,
      default: 0,
    },
    createdAt: {
      type: Date,
      index: true,
    },
    updatedAt: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true },
  { _id: true },
);

OrderSchema.pre("save", function (next) {
  this.updatedAt = moment();
  next();
});
pedidoSchema.pre("save", function (next) {
  this.updatedAt = moment();
  next();
});
/*  */
const Orders = mongoose.model("orders", OrderSchema);

OrderSchema.index({createdAt: 1, status : 1})


export default Orders;
