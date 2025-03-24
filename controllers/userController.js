const CoinGecko = require("coingecko-api");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

const uploadFromBuffer = (file) =>
  new Promise((resolve, reject) => {
    const cldUploadStream = cloudinary.uploader.upload_stream(
      /*{
        folder: "foo"
      },*/
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(cldUploadStream);
  });

const deleteImageFromCloudinary = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

module.exports.home = (req, res, next) => {
  res.render("index");
};

module.exports.getUser = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    User.findById(req.params.id),
    req.query
  ).limitFields();
  const user = await features.query;

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

module.exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.updateDP = catchAsync(async (req, res, next) => {
  // Check if a file is uploaded
  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Please upload an image.",
    });
  }
  const user = await User.findById(req.params.id);
  let prevImageId;
  if (user.imageId) {
    prevImageId = user.imageId;
  }
  // Upload image to Cloudinary
  const result = await uploadFromBuffer(req.file);
  //console.log(result);
  // Update the user with the Cloudinary URL
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { profilePic: result.secure_url, imageId: result.public_id },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: { user: updatedUser },
  });
  if (prevImageId) {
    await deleteImageFromCloudinary(prevImageId);
  }
});

exports.dashboard = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user || password !== user.password) {
    res.status(401).json({
      status: "fail",
    });
  }

  res.status(200).json({
    status: "success",
  });
});

module.exports.deposit = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("deposit", { data });
});

module.exports.withdrawal = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("withdrawal", { data });
});

module.exports.profile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("user-profile", { data });
});

module.exports.settings = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const data = {
    user,
  };
  res.render("settings", { data });
});

module.exports.getCurrentPrice = catchAsync(async (req, res, next) => {
  const CoinGeckoClient = new CoinGecko();
  const data = await CoinGeckoClient.exchanges.fetchTickers("bitfinex", {
    coin_ids: ["bitcoin", "ethereum", "ripple", "litecoin", "stellar"],
  });

  const _coinList = {};
  const _datacc = data.data.tickers.filter((t) => t.target == "USD");

  ["BTC", "ETH", "XRP", "LTC", "XLM"].forEach((i) => {
    const _temp = _datacc.filter((t) => t.base == i);
    const _res = _temp.length == 0 ? [] : _temp[0];
    _coinList[i] = _res.last;
  });

  res.status(200).json({
    data: _coinList,
  });
});
