import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img, taggedUsers } = req.body;

    // Check if postedBy and text fields are provided
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required" });
    }

    // Check if the user exists
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is authorized to create the post
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    // Check if the text exceeds the maximum length
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // Upload the image to Cloudinary if provided
    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    // Extract tagged usernames from the text
    const mentionedUsernames = text.match(/@(\w+)/g) || [];
    const mentionedUsers = await User.find({
      username: { $in: mentionedUsernames.map((u) => u.slice(1)) },
    });

    taggedUsers = mentionedUsers.map((user) => user._id);

    console.log("Tagged user IDs:", taggedUsers);

    // Create a new post
    const newPost = new Post({ postedBy, text, img, taggedUsers });

    await newPost.save();

    await newPost.populate("postedBy", "_id username profilePic");
    await newPost.populate("taggedUsers", "_id username");

    console.log("Creating new post:", {
      postedBy: newPost.postedBy,
      text: newPost.text,
      taggedUsers: newPost.taggedUsers,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getPost = async (req, res) => {
  try {
    // Find the post by its ID
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    // Find the post by its ID
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // making sure user is deleting their own post
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete post" });
    }

    // Delete the image from Cloudinary if it exists
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    // Check if the text field is provided
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    // Find the post by its ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a new reply object
    const reply = { userId, text, userProfilePic, username };

    // Add the reply to the post's replies array
    post.replies.push(reply);
    await post.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    // Find all posts and populate the postedBy field with user details
    const feedPosts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name username profilePic");

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filtered feed posts for only who users follow

/* // before 
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; */

const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Fetching posts for user:", user._id);

    const posts = await Post.find({
      $or: [{ postedBy: user._id }, { taggedUsers: user._id }],
    })
      .populate("postedBy", "_id username profilePic")
      .populate("taggedUsers", "_id username")
      .sort({ createdAt: -1 });

    console.log("Posts found:", posts.length);
    console.log(
      "Posts details:",
      posts.map((p) => ({
        id: p._id,
        postedBy: p.postedBy.username,
        taggedUsers: p.taggedUsers.map((u) => u.username),
        text: p.text.substring(0, 50) + "...",
      }))
    );

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
};
