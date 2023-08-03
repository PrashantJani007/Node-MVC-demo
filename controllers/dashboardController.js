const User = require('../models').User;
const Location = require('../models').Location;
const Station = require('../models').Station;
const Contact = require('../models').Contact;
const Blog = require('../models').Blog;
const {STATUS} = require('../models/user');
const {LOCATION_STATUS} = require('../models/location');
const {BLOG_STATUS} = require('../models/blog');
const index = async(req,res)=>{

    const users = await User.count();
    const locations = await Location.count();
    const stations = await Station.count();
    const contacts = await Contact.count();
    const blogs = await Blog.count();
    
    const array = [
        {
            title:'Users',
            count:users,
            route:"/admin/users",
            class:'bg-warning',
            icon:'fas fa-solid fas fa-users'
        },
        {
            title:'Locations',
            count:locations,
            route:"/admin/locations",
            class:'bg-success',
            icon:'fas fa-solid fa-map-location'
        },
        {
            title:'Stations',
            count:stations,
            route:"/admin/locations",
            class:'bg-primary',
            icon:'fas fa-solid fa-charging-station'
        },
        {
            title:'Blogs',
            count:blogs,
            route:"/admin/blogs",
            class:'bg-danger',
            icon:'fas fa-solid fa-blog'
        },
        {
            title:'Contact Us',
            count:contacts,
            route:"/admin/contacts",
            class:'bg-secondary',
            icon:'fas fa-solid fa-phone'
        },
    ];

    res.render('dashboard',{data:req,title:'Dashboard',array});
}

module.exports = {index}