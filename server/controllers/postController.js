const Post = require('../models/postModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');
const {v4: uuid} = require('uuid');
const HttpError = require('../models/errorModel');

// Create a post
// POST /api/recipes
// PROTECTED
const createPost = async (req, res, next) => {
    try {
        let {title, category, desc} = req.body;
        if (!title || !category || !desc || !req.files) {
            return next(new HttpError('Please fill in all fields', 422));
        }
        const {thumbnail} = req.files;

        // Check if the post has a thumbnail
        if (!thumbnail) {
            return next(new HttpError('Please upload a thumbnail', 422));
        }

        // Check the file size
        if (thumbnail.size > 2000000) {
            return next(new HttpError('File size too large. Should not exceeds 2MB.', 422));
        }
        let fileExtension = thumbnail.name.split('.')[1];
        let newFileName = uuid() + '.' + fileExtension;
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err));
            } else {
                const newPost = await Post.create({ title, category, desc, thumbnail: newFileName, creator: req.user.id });
                //console.log(req.user.id)
                if (!newPost) {
                    return next(new HttpError('Could not create post', 422));
                }
                // Update the user's posts count
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});

                res.status(201).json(newPost);
            }
        });

    } catch (error) {
        return next(new HttpError(error))
    }
}

// Get all posts
// GET /api/recipes
// UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({updatedAt: -1});
        if (!posts) {
            return next(new HttpError('No posts found', 404));
        } else {
            res.status(200).json(posts);
        }
    } catch (error) {
        return next(new HttpError(error));
    }
}

// Get a single post
// GET /api/recipes/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID);
        if (!post) {
            return next(new HttpError('Post not found', 404));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// Get posts by category
// GET /api/recipes/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const {category} = req.params;
        const posts = await Post.find({category}).sort({createddAt: -1});
        if (!posts) {
            return next(new HttpError('No posts found', 404));
        }
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// Get posts by user
// GET /api/recipes/users/:id
// UNPROTECTED
const getUserPosts = async (req, res, next) => {
    try {
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createddAt: -1});
        if (!posts) {
            return next(new HttpError('No posts found', 404));
        }
        res.status(200).json(posts);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// Edit a post
// PATCH /api/recipes/:id
// PROTECTED
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postID = req.params.id;
        let {title, category, desc} = req.body;
        
        // ReactQuill already has opening/closing tag
        // with a break tag in between makes it 11 characters
        if (!title || !category || desc.length < 12) {
            return next(new HttpError('Please fill in all fields', 422));
        }

        // Get old post from DB
        const oldPost = await Post.findById(postID);
        if(req.user.id == oldPost.creator) {
            if(!req.files) {
                updatedPost = await Post.findByIdAndUpdate(postID, {title, category, desc}, {new: true});
            } else {
                // Delete old thumbnail
                fs.unlink(path.join(__dirname, '..', '/uploads', oldPost.thumbnail), async (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                });
    
                // Upload new thumbnail
                const {thumbnail} = req.files;
                // Check the file size
                if (thumbnail.size > 1024 * 1024) {
                    return next(new HttpError('File size too large', 422));
                }
                let fileExtension = thumbnail.name.split('.')[1];
                newFileName = uuid() + '.' + fileExtension;
                thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
                    if (err) {
                        return next(new HttpError(err));
                    }
                });
    
                // Update post
                updatedPost = await Post.findByIdAndUpdate(postID, {title, category, desc, thumbnail: newFileName}, {new: true});
            }
        } else {
            return next(new HttpError('You cannot edit a post that is not yours.', 422));
        }
        if (!updatedPost) {
            return next(new HttpError('Could not update post', 422));
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error));
    }
}

// Delete a post
// DELETE /api/recipes/:id
// PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postID = req.params.id;
        if (!postID) {
            return next(new HttpError('This post may have been removed or unavailable at the moment.', 404));
        }
        const post = await Post.findById(postID);
        const fileName = post.thumbnail;

        // Check if current user is the creator of the post
        if (post.creator.toString() == req.user.id) {
            // Delete post thumbnail
        fs.unlink(path.join(__dirname, '..', '/uploads', fileName), async (err) => {
            if (err) {
                return next(new HttpError(err));
            } else {
                // Delete post
                await Post.findByIdAndDelete(postID);
                // Update the user's posts count
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts - 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount});
                res.status(200).json({message: 'Post deleted successfully'});
            }
        });
        } else {
            return next(new HttpError('You cannot delete a post that is not yours.', 422));
        }
    } catch (error) {
        return next(new HttpError(error));
    }
}

module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPosts, editPost, deletePost};