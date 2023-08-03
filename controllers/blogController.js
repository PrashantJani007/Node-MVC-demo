const Category = require('../models').Category;
const Tags = require('../models').Tags;
const Blog = require('../models').Blog;
const BlogCategory = require('../models').BlogCategory;
const BlogTag = require('../models').BlogTag;
const {blogValidation} = require('../validations/blogValidation');
const fs = require('fs');
const path = require('path');
const {BLOG_STATUS} = require('../models/blog');
const { Op } = require('sequelize');

const index = async(req,res)=>{
    
    var categories = await Category.findAll();
    var tags = await Tags.findAll();
    
    if(req.xhr){
        
        var draw = parseInt(req.query.draw);
        var start = parseInt(req.query.start);
        var length = parseInt(req.query.length);
        var name = 'id';
        var dir = 'desc';
        
        if(req.query.order != undefined){
            var order = req.query.order;
            column = order[0].column;
            var name = req.query.columns[column].name;
            dir = req.query.order[0].dir;
        }
        
        var search_value = req.query.search['value'];
        
        var blogsCount = await Blog.count({
            // offset:start,
            // limit:length,
            where:{
                [Op.or]:[
                    {
                        title: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        visit_count: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        created_at: {
                            [Op.like]: `%${search_value}%`
                        }
                    },

                ]   
            },
            // attributes:['id','name','','email','country','role','status'],
            order:[[name,dir]]
        });
        
        var blogs = await Blog.findAll({
            offset:start,
            limit:length,
            where:{
                [Op.or]:[
                    {
                        title: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        visit_count: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                    {
                        created_at: {
                            [Op.like]: `%${search_value}%`
                        }
                    },
                ]   
            },
            attributes:['id','title','image','visit_count','status','created_at'],
            order:[[name,dir]]
        });
        
        var output = {
            'draw' : draw,
            'recordsTotal' : blogsCount,
            'recordsFiltered' : blogsCount,
            'data' : blogs
        };
        
        return res.json(output);
        
    }
    
    res.render('blogs',{data:req,title:'Blogs',categories,tags});
}

const store = async(req,res)=>{
    
    try {
        
        const result = blogValidation(req.body);
        if(result.error){
            console.log("dasdad");
            return res.status(422).json({status:false,error:result.error.message});
        }
        
        const {
            id,
            title,
            category,
            tag,
            description,
            image
        } = req.body;
        
        const data = {
            title,
            description,
            visit_count:0,
            status:BLOG_STATUS.ACTIVE
        }
        
        if(image != 'undefined' && image != ''){
            
            var dir = './storage/images/blogs'
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }  
            
            //remove existing image code
            if(id != '' && image != undefined && image != ''){
                const getBlogImage = await Blog.findOne({where:{id},
                    attributes:['id','image'],
                    raw:true
                });
                console.log(getBlogImage.image);
                if(getBlogImage.image != null){
                    fs.unlinkSync(process.cwd()+"/storage/images/blogs/"+getBlogImage.image);
                    await Blog.update({image:null},{where:{id}});
                }
            }
            
            //Image Upload
            if(image != undefined && image != ''){
                var imageType = image.substring(
                    image.indexOf("/") + 1, 
                    image.lastIndexOf(";")
                    );
                    
                    var imageName = Date.now().toString()+"."+imageType;
                    
                    var base64Data = req.body.image.replace(/^data:image\/[a-z]+;base64,/, "");
                    await fs.writeFile(path.join(__dirname,'../storage/images/blogs',imageName), base64Data, 'base64', function(err) {
                        console.log(err,'image');
                    });
                    data.image = imageName;
                }
            }
            
            if(id == undefined || id == ''){
                const createBlog = await Blog.create(data);
                var blogCategories = [];
                
                for (let i = 0; i < category.length; i++) {
                    const obj = {
                        blog_id:createBlog.id,
                        category_id:parseInt(category[i])
                    }
                    blogCategories.push(obj);
                }
                
                var blogTags = [];
                
                for (let i = 0; i < tag.length; i++) {
                    const obj = {
                        blog_id:createBlog.id,
                        tag_id:parseInt(tag[i])
                    }
                    blogTags.push(obj);
                }
                
                const createBlogCategories = await BlogCategory.bulkCreate(blogCategories);
                const createBlogTags = await BlogTag.bulkCreate(blogTags);
            }else{
                delete data.visit_count;
                const updateBlog = await Blog.update(data,{where:{id}});    
                
                const deleteBlogCategories = await BlogCategory.destroy({where:{blog_id:id}});
                const deleteBlogTags = await BlogTag.destroy({where:{blog_id:id}});
                
                var blogCategories = [];
                
                for (let i = 0; i < category.length; i++) {
                    const obj = {
                        blog_id:id,
                        category_id:parseInt(category[i])
                    }
                    blogCategories.push(obj);
                }
                
                var blogTags = [];
                
                for (let i = 0; i < tag.length; i++) {
                    const obj = {
                        blog_id:id,
                        tag_id:parseInt(tag[i])
                    }
                    blogTags.push(obj);
                }
                
                const createBlogCategories = await BlogCategory.bulkCreate(blogCategories);
                const createBlogTags = await BlogTag.bulkCreate(blogTags);
            }
            
            
            return res.status(201).json({status:true,message:'Blog created successfully!'});
            
        } catch (error) {
            console.log("asdasd");
            return res.status(400).json({status:false,error:error});
        }
        
    }
    
    const changeStatus = async(req,res)=>{
        
        try {
            const id = req.params.id;
            const blog = await Blog.findOne({where:{id},attributes:['status']});
            var message = '';
            if(blog.status == BLOG_STATUS.ACTIVE){
                const updateBlog = await Blog.update({status:BLOG_STATUS.IN_ACTIVE},{where:{id}});
                message = 'Blog De-activated successfully!';
            }else{
                const updateBlog = await Blog.update({status:BLOG_STATUS.ACTIVE},{where:{id}});
                message = 'Blog activated successfully!';
            }
            return res.status(200).json({status:true,message});
        } catch (error) {
            return res.status(400).json({status:false,error:error.message});
        }
    } 
    
    const destroy = async(req,res)=>{
        
        try {
            
            const id = req.params.id;
            const deleteBlog = await Blog.destroy({where:{id}});
            return res.status(200).json({status:true,message:'Blog deleted successfully!'});
            
        } catch (error) {
            return res.status(400).json({status:false,error:error.message});
        }
    }
    
    const multipleDelete = async(req,res)=>{
        
        try {
            const ids = req.body.ids
            const deleteBlogs = await Blog.destroy({where:{id:ids}});
            return res.status(200).json({status:true,message:'Data deleted successfully!'});
        } catch (error) {
            return res.status(400).json({status:false,error:error.message});
        }
    }
    
    const edit = async(req,res)=>{
        
        try {
            const id = parseInt(req.params.id);
            const blogData = await Blog.findOne({
                where:{id},
                include:[{
                    model:BlogCategory,
                    attributes:{
                        exclude:['created_at','updated_at']
                    },
                    include:{
                        model:Category,
                        attributes:['id','name']
                    }
                },{
                    model:BlogTag,
                    attributes:{
                        exclude:['created_at','updated_at']
                    },
                    include:{
                        model:Tags,
                        attributes:['id','name']
                    }
                }]
            });
            
            return res.status(200).json({status:true,data:blogData});
        } catch (error) {
            return res.status(400).json({status:false,error:error.message});            
        }
    }
    module.exports = {index,store,changeStatus,destroy,multipleDelete,edit}