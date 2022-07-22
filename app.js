const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/ecommerceDB");

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name!"]
  },
  address: {
    type: String,
    required: [true, "please enter the address!"]
  },
  phoneNumber: Number,
  orderID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Order",
    required: true
  }
});

const Customer = mongoose.model("Customer", customerSchema);

const productSchema = mongoose.Schema({
  prodName: {
    type: String,
    required: [true, "Please enter the product name"]
  },
  description: String,
  price: {
    type: Number,
    required: [true, "please enter the price"]
  }
});

const Product = mongoose.model("Product", productSchema);

const orderSchema = mongoose.Schema({
  customerID: {
    type: mongoose.Schema.Types.ObjectID,
    ref: "Customer",
    required: true
  },
  productsID: [
    {
      type: mongoose.Schema.Types.ObjectID,
      ref: "Product",
      required: true
    }
  ],
  totalPrice: {
    type: Number,
    default: 0
  }
});

const Order = mongoose.model("Order", orderSchema);

//////Operations on all customers////////

app
  .route("/customers")
  .get(function(req, res) {
    Customer.find(function(err, foundCustomers) {
      if (!err) {
        res.send(foundCustomers);
      } else {
        console.log(err);
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newOrder = new Order({
      productID: [],
      customerID: ""
    });
    const id = newOrder._id;
    const newCustomer = new Customer({
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      orderID: id
    });
    newOrder.customerID=newCustomer._id;
    newCustomer.save(function(err) {
      if (!err) {
        res.send("Info added");
      } else {
        console.log(err);
        res.send(err);
      }
    });
    newOrder.save();
  })
  .delete(function(req, res) {
    Customer.deleteMany(function(err) {
      if (!err) {
        res.send("All customers data deleted");
      } else {
        console.log(err);
        res.send(err);
      }
    });
  });

/////Operations for single customer/////

app
  .route("/customers/:customerName")
  .get(function(req, res) {
    Customer.findOne({ name: req.params.customerName }, function(
      err,
      foundCustomer
    ) {
      if (foundCustomer) {
        res.send(foundCustomer);
      } else {
        res.send("No customer found");
      }
    });
  })
  .put(function(req, res) {
    Customer.findOneAndUpdate(
      { name: req.params.customerName },
      {
        name: req.body.name,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber
      },
      { overwrite: true },
      function(err) {
        if (!err) {
          res.send("Updated successfully");
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  })
  .patch(function(req, res) {
    Customer.updateOne(
      { name: req.params.customerName },
      { $set: req.body },
      function(err) {
        if (!err) {
          res.send("Successfully updated");
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  })
  .delete(function(req, res) {
    Customer.deleteOne({ name: req.params.customerName }, function(err) {
      if (!err) {
        res.send("successfully deleted");
      } else {
        console.log(err);
        res.send(err);
      }
    });
  });

//////Operations for all products/////

app
  .route("/products")
  .get(function(req, res) {
    Product.find(function(err, foundProducts) {
      if (!err) {
        res.send(foundProducts);
      } else {
        console.log(err);
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newProduct = new Product({
      prodName: req.body.prodName,
      description: req.body.description,
      price: req.body.price
    });
    newProduct.save(function(err) {
      if (!err) {
        res.send("Info added");
      } else {
        console.log(err);
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Product.deleteMany(function(err) {
      if (!err) {
        res.send("All products data deleted");
      } else {
        console.log(err);
        res.send(err);
      }
    });
  });

/////Operations for single product///////

app
  .route("/products/:productName")
  .get(function(req, res) {
    Product.findOne({ prodName: req.params.productName }, function(
      err,
      foundProduct
    ) {
      if (foundProduct) {
        res.send(foundProduct);
      } else {
        res.send("No product found");
      }
    });
  })
  .put(function(req, res) {
    Product.findOneAndUpdate(
      { prodName: req.params.productName },
      {
        prodName: req.body.prodName,
        description: req.body.description,
        price: req.body.price
      },
      { overwrite: true },
      function(err) {
        if (!err) {
          res.send("Updated successfully");
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  })
  .patch(function(req, res) {
    Product.updateOne(
      { prodName: req.params.productName },
      { $set: req.body },
      function(err) {
        if (!err) {
          res.send("Successfully updated");
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  })
  .delete(function(req, res) {
    Product.deleteOne({ prodName: req.params.productName }, function(err) {
      if (!err) {
        res.send("successfully deleted");
      } else {
        console.log(err);
        res.send(err);
      }
    });
  });

////Operations for all orders////////

app
  .route("/Orders")
  .get(function(req, res) {
    Order.find(function(err, foundOrders) {
      if (!err) {
        res.send(foundOrders);
      } else {
        console.log(err);
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const custID = req.body.customerID;
    Customer.findOne({ _id: custID }, function(err, foundCustomer) {
      if (err) {
        console.log(err);
      } else {
        const productID = req.body.productID;
        const OrderID = foundCustomer.orderID;
        Order.findOne({ _id: OrderID }, function(err, foundOrder) {
          if (err) {
            console.log(err);
          } else {
            let total = foundOrder.totalPrice;

            Product.findById(productID, function(err, foundProduct) {
              if (!err) {
                total = total + foundProduct.price;
                foundOrder.totalPrice = total;
                console.log(foundOrder.totalPrice);

                foundOrder.productsID.push(productID);
                foundOrder.save();
              } else {
                console.log(err);
              }
            });

            res.send(foundOrder);
          }
        });
      }
    });
  });

app.listen(3000, function() {
  console.log("server is working");
});
