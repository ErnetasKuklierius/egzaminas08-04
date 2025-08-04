const express = require("express");
const router = express.Router();
const {
  createAd,
  getAllAds,
  getAllCustomAds,
  updateAd,
  deleteAd,
} = require("../controllers/adsController");
const { protect } = require("../middleware/authMiddleware");


router.route("/").post(protect, createAd).get(getAllAds);
router.route("/myAds").get(protect, getAllCustomAds);
router.route("/:id").put(protect, updateAd);
router.route("/:id").delete(protect, deleteAd);

module.exports = router;
