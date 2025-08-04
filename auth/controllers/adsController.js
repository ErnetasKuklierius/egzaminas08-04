const asynchandler = require("express-async-handler");
const Ad = require("../models/Ad.js");

//POST /ads

const createAd = asynchandler(async (req, res) => {
  const { title, description, price } = req.body;

  if (!title || !description || !price) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  const newAd = await Ad.create({
    title: title,
    description: description,
    price: price,
    user: req.user.id,
  });
  res.status(200).json(newAd);
});

// Get all ads
//GET  /ads

const getAllAds = asynchandler(async (req, res) => {
  const allAds = await Ad.find();
  res.status(200).json(allAds);
});
// Get custom ads
//GET  /ads
const getAllCustomAds = asynchandler(async (req, res) => {
  const allCustomAds = await Ad.find({ user: req.user.id });
  res.status(200).json(allCustomAds);
});

// Update ad data
//PUT  /ads/:id

const updateAd = asynchandler(async (req, res) => {
  const findAd = await Ad.findById(req.params.id);
  if (!findAd) {
    res.status(400);
    throw new Error("Ad not found");
  }
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (findAd.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }
  if (req.user.role === "admin" || findAd.user.toString() === req.user.id) {
    const updateAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updateAd);
  }
});

// DELETE custom ad
// DELETE /ads/:id
const deleteAd = asynchandler(async (req, res) => {
  const findAd = await Ad.findById(req.params.id);
  if (!findAd) {
    res.status(400);
    throw new Error("Ad not found");
  }
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (findAd.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }
  if (findAd.user.toString() === req.user.id || req.user.role === "admin") {
    await Ad.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Ad deleted" });
  }
});

module.exports = {
  createAd,
  getAllAds,
  getAllCustomAds,
  updateAd,
  deleteAd,
};
