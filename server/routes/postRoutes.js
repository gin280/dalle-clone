import express from "express"
import * as dotenv from "dotenv"
import { v2 as cloudinary } from "cloudinary"

import Post from "../mongodb/models/post.js"

dotenv.config()

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SECRET,
})

router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({})
    res.status(200).json({ success: true, data: posts })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    })
  }
})

router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body
    const photoUrl = await cloudinary.uploader.upload(photo, {})
    console.log(photoUrl, "photoUrl")
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    })

    res.status(200).json({ success: true, data: newPost })
  } catch (err) {
    console.log(err, "err")
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    })
  }
})

export default router
