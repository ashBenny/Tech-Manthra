const express= require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')


// show add story page
router.get('/add',ensureAuth,(req,res)=>{
    res.render('stories/add')
});


// submit new story
router.post('/', ensureAuth, async (req, res) => {

    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.render('errors/500')
    };
});


// Show all stories
router.get('/', ensureAuth, async(req, res)=>{
    try {
        const stories = await Story.find({status : 'public'})
        .populate('user')
        .sort({ createdAt : 'desc' })
        .lean()

        res.render('stories/index', { stories })

    } catch (error) {
        console.log(error);
        res.render('errors/500')
    }
});

// Show one story
router.get('/:id', ensureAuth, async(req, res)=>{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()
        
        if(!story){
            res.render('errors/404')
        };
        res.render('stories/show', { story })
    
    } catch (error) {
        log.error(error);
        res.render('errors/404')
    };

});

// Show One users all stories

router.get('/user/:userId', ensureAuth, async(req, res)=>{
    try {
        let stories = await Story.find({ user : req.params.userId, status : 'public' })
        .populate('user')
        .lean()

        res.render('/stories/index', { stories })

    } catch (error) {
        console.log(error);
        res.render('errors/404')
    }
});


// Edit page
router.get('/edit/:id', ensureAuth, async(req, res) => {
    try {
        const story = await Story.findOne({ _id : req.params.id })
        .lean();

    res.render('stories/edit', { story })
    } catch (error) {
        console.log(error);
        res.render('errors/500')
    }
});


// Update story
router.put('/:id', ensureAuth, async(req, res) => {
    try {
        let story = await Story.findById( req.params.id ).lean();
        story = await Story.findByIdAndUpdate({ _id : req.params.id }, req.body, {
        new : true,
        runValidators : true
    })
    res.redirect('/dashboard')
        
    } catch (error) {
        console.log(error);
        res.render('errors/500')
    }
    
});


// Delete story
router.delete('/delete/:id', ensureAuth, async(req, res) => {
    try {
        let deleteStory = await Story.findByIdAndDelete({_id : req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
        res.render('errors/500')
    }
});


module.exports = router;