var express = require('express');
var router = express.Router();
const Razorpay = require('razorpay')

const userModel = require('./users')
const passport = require('passport')
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register');
});




//##################### User authentication routes #####################

router.post('/register',async (req, res, next) => {
  const userData =await new userModel({
    username: req.body.username,
    email:req.body.email,
    password:req.body.passport
  })
  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/')
      })
    })
  
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/feed',
  failureRedirect: '/login',
  failureFlash: true
}),
  function (req, res) { }
)

router.get('/logout', (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/');
      }

    })
  else {
    res.redirect('/');
  }
});

function islogedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()
  res.redirect('/login')
}


//##################### User authentication routes #####################
router.get('/feed',function(req,res,next){
  res.render('feed');
})


router.get('/feed/books',function(req,res,next){
  res.render('Books');
})
router.get('/feed/books/booksubject',function(req,res,next){
  res.render('booksubject');
})

  router.get('/index',function(req,res,next){
    res.render('index');


  })




  // Razer-Pay



  const instance = new Razorpay({
    key_id: 'rzp_test_RG8SmW8Vs3CEfQ',
    key_secret: 'Lu6olzRv5WOdTRJEhoYvWykL',
  });
  router.post('/create/orderId', function (req, res) {
    // console.log(req.body.product_Id)
    // let product=await product.findById(req.body.product_Id);
    var options = {
      amount: 99 * 100*(83.30),  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
      res.send(order)
    });
  })


  router.post('/api/payment/verify', function (req, res) {
    var { validatePaymentVerification, validateWebhookSignature } =
    require('../node_modules/razorpay/dist/utils/razorpay-utils');
    const razorpayOrderId=req.body.response.razorpay_order_id;
    const razorpayPaymentId=req.body.response.razorpay_payment_id;
    const signature=req.body.response.razorpay_signature;
    const secret='Lu6olzRv5WOdTRJEhoYvWykL';
    const result= validatePaymentVerification({ "order_id": razorpayOrderId, "payment_id": razorpayPaymentId }, signature, secret);
     res.send(result)
   })


module.exports = router;
