const passport = require('passport');
const express= require('express');
const router = express.Router();

// Auth with google -> (In Passport doc)
router.get('/google', 
    passport.authenticate('google', { scope: ['profile'] }));


// Google auth call back  -> (In Passport doc)
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
    res.redirect('/dashboard');
});


// Logout
router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
});






module.exports = router