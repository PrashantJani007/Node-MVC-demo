const Blog = require('../../models').Blog;
const Category = require('../../models').Category;
const Tags = require('../../models').Tags;
const BlogCategory = require('../../models').BlogCategory;
const BlogTag = require('../../models').BlogTag;
const sequelize = require('../../models').sequelize;
const {BLOG_STATUS} = require('../../models/blog');

const index = async(req,res)=>{
    var blogs = await Blog.findAll({where:{status:BLOG_STATUS.ACTIVE}});
    if(blogs == null){
        blogs = [];
    }
    return res.status(200).json({status:true,code:200,message:"All blogs",data:blogs});
}

const show = async(req,res)=>{
    
    try {
        const id = req.params.id;
        
        var blog = await Blog.findOne(
            {
                where:{id},
            });
            if(blog == null){
                blog = [];
            }
            return res.status(200).json({status:true,message:"Single Blog",data:blog});
        } catch (error) {
            return res.status(400).json({status:false,message:error.errors});
        }
    }
    
    const categories = async(req,res)=>{
        var categories = await Category.findAll({
            
            attributes: [
                "name",
                [sequelize.fn("COUNT", sequelize.col("BlogCategories.category_id")), "total"],
            ],
            include: [
                {
                    model: BlogCategory,
                    attributes: [],
                },
            ],
            group: ["Category.id"],
        });
        if(categories == null){
            categories = [];
        }
        return res.status(200).json({status:true,message:'All categories',data:categories});
    }
    
    const popularBlogs = async(req,res)=>{
        
        var blogs = await Blog.findAll({
            limit:2,
            where:{status:BLOG_STATUS.ACTIVE},
            order:[['visit_count','desc']]
        });
        if(blogs == null){
            blogs = [];
        }
        return res.status(200).json({status:true,message:'Popular blogs',data:blogs});
    }
    
    const popularTags = async(req,res)=>{
        
        var tags = await Tags.findAll({
                
            attributes: [
                "id",
                "name",
                [sequelize.fn("COUNT", sequelize.col("BlogTags.tag_id")), "total"],
                
            ],
            include: [
                {
                    model: BlogTag,
                    attributes: [],
                },
            ],
            subQuery:false,
            group: ["Tags.id"],
            order:[['total','desc']],
            limit:3
        });
        if(tags == null){
            tags = [];
        }
        return res.status(200).json({status:true,message:'Popular tags',data:tags});
    }
    module.exports = {index,show,categories,popularBlogs,popularTags}