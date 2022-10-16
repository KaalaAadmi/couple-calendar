const router = require("express").Router();
require("dotenv").config();
const mongoose = require("mongoose");
const Data = require("../models/Data");

router.get("/all-events", async (req, res, next) => {
  try {
    const allEvents = await Data.find();
    return res.json(allEvents);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/add", async (req, res) => {
  const newData = new Data({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    allDay: req.body.allDay,
    colorEvent: req.body.colorEvent,
    color: req.body.color,
  });
  try {
    const saveData = await newData.save();
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Failure" });
  }
});

router.post("/modify", async (req, res) => {
  try {
    const id = req.body._id;
    const res = await Data.findByIdAndUpdate(id, {
      title: req.body.newTitle,
      start: req.body.newStart,
      end: req.body.newEnd,
      allDay: req.body.allDay,
      colorEvent: req.body.colorEvent,
      color: req.body.color,
    });
    res.status(200).json({ message: success });
  } catch (err) {
    res.status(500).json(error);
  }
});

router.post("/delete", async (req, res) => {
  try {
    Data.deleteOne({ _id: req.body._id })
      .then(function () {
        res.status(200).json({ message: "Success" });
      })
      .catch(function (error) {
        res.status(500).json(error);
      });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
