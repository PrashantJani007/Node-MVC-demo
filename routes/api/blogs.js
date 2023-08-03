const { index, show, categories, popularBlogs, popularTags } = require('../../controllers/api/blogController');

const router = require('express').Router();

router.get('/blogs',index);
router.get('/blogs/categories',categories);
router.get('/blogs/popular-blogs',popularBlogs);
router.get('/blogs/popular-tags',popularTags);
router.get('/blogs/:id',show);

module.exports = router;