import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, isAnonymous, selectedUsers } = req.body;
    let { img, taggedUsers } = req.body;

    console.log("Received post data:", {
      postedBy,
      text,
      isAnonymous,
      selectedUsers,
      taggedUsers,
    });

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

    // Shuffled Users
    let shuffledUsers = [];
    if (
      isAnonymous &&
      Array.isArray(selectedUsers) &&
      selectedUsers.length > 0
    ) {
      const selectedUserObjects = await User.find({
        _id: { $in: selectedUsers },
      });
      const poster = await User.findById(postedBy);
      const allUsers = [...selectedUserObjects, poster];
      shuffledUsers = allUsers.sort(() => 0.5 - Math.random());
    }

    // Create a new post
    const newPost = new Post({
      postedBy,
      text,
      img,
      taggedUsers,
      isAnonymous,
      shuffledUsers: shuffledUsers.map((u) => u._id),
    });

    await newPost.save();
    await newPost.populate("postedBy", "_id username profilePic");
    await newPost.populate("taggedUsers", "_id username");
    await newPost.populate("shuffledUsers", "_id username profilePic");

    console.log("Created post:", newPost);

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("postedBy", "username profilePic")
      .populate("shuffledUsers", "username profilePic");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("Fetched post:", JSON.stringify(post, null, 2));
    res.status(200).json(post);
  } catch (err) {
    console.error("Error in getPost:", err);
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
      .populate("postedBy", "name username profilePic")
      .populate("shuffledUsers", "username profilePic");

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
    console.log("Fetching posts for username:", username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found for username:", username);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User found:", user._id);

    const query = {
      $or: [
        { postedBy: user._id },
        { taggedUsers: user._id },
        { shuffledUsers: user._id },
      ],
    };
    console.log("Query:", JSON.stringify(query));

    const posts = await Post.find(query)
      .populate("postedBy", "_id username profilePic")
      .populate("taggedUsers", "_id username")
      .populate("shuffledUsers", "_id username profilePic")
      .sort({ createdAt: -1 });

    console.log("Total posts found:", posts.length);

    const userPosts = posts.filter(
      (post) =>
        post.postedBy._id.toString() === user._id.toString() &&
        !post.isAnonymous
    );
    const taggedPosts = posts.filter(
      (post) =>
        post.postedBy._id.toString() !== user._id.toString() &&
        post.taggedUsers.some((u) => u._id.toString() === user._id.toString())
    );
    const teabagPosts = posts.filter(
      (post) =>
        post.isAnonymous &&
        post.shuffledUsers.some((u) => u._id.toString() === user._id.toString())
    );

    console.log("User's own posts:", userPosts.length);
    console.log("Posts where user is tagged:", taggedPosts.length);
    console.log("Teabag posts:", teabagPosts.length);

    res.status(200).json({ userPosts, taggedPosts, teabagPosts });
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserTeabags = async (req, res) => {
  console.log("getUserTeabags called");
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const teabags = await Post.find({
      isAnonymous: true,
      shuffledUsers: user._id,
    })
      .populate("postedBy", "_id username profilePic")
      .populate("shuffledUsers", "_id username profilePic")
      .sort({ createdAt: -1 });

    console.log("Teabags found:", teabags); // Add this line for debugging

    res.status(200).json(teabags);
  } catch (error) {
    console.error("Error in getUserTeabags:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTaggedPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const taggedPosts = await Post.find({ taggedUsers: user._id })
      .populate("postedBy", "_id username profilePic")
      .populate("taggedUsers", "_id username")
      .sort({ createdAt: -1 });

    res.status(200).json({ taggedPosts });
  } catch (error) {
    console.error("Error in getTaggedPosts:", error);
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
  getUserTeabags,
  getTaggedPosts,
};
