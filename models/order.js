var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
   customerId: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
                },
   name: String,
   date: Date,
   time: String,
   area: String,
   paymentType: { type: String, default: 'COD'},
   status: { type: String, default: 'order_placed'},
   createdAt: { type: Date, default: Date.now },
  
	
module.exports = mongoose.model("Order", OrderSchema);