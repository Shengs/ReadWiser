'use strict';

var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

module.exports = function (router) {
    router.get('/', function (req,res) {
        // Get cart from session
        var cart = req.session.cart;
        var displayCart = {items:[], total:0}
        var total = 0;

        // Get total
        for (var item in cart) {
          displayCart.items.push(cart[item]);
          total += (cart[item].qty * cart[item].price)
        }
        displayCart.total = total.toFixed(2);

        // Render Cart
        res.render('cart/index', {
          cart: displayCart
        })
    });

    // Add to Cart
    router.post('/:id', function (req, res) {         
       	req.session.cart = req.session.cart || {};      
        var cart = req.session.cart;

        Book.findOne({_id:req.params.id}, function (err, book) {
          if (err) {
            console.log(err)
          }

          if (cart[req.params.id]) {
            cart[req.params.id].qty++;
          } else {
            cart[req.params.id] = {
              item:book._id,
              title:book.title,
              price:book.price,
              qty: 1
            }
          }
          req.flash('success', "The book has been added to the cart.");
          res.redirect('/cart')
        })      
    });


    // Reset Cart
    router.get('/remove', function (req,res) {
        // Reset the cart in session
        req.session.cart = null;
        req.flash('success',"Cart has been reset.");
        res.redirect('/cart')
    });


    // Remove book
    router.get('/removeItem/:id', function (req, res) {

        var item = req.session.cart[req.params.id];

        if (item.qty > 1) {
          item.qty = item.qty - 1;
        } else {
          delete req.session.cart[req.params.id];
        };

        req.flash('success',"Book has been removed.");
        res.redirect('/cart')
    })

};
