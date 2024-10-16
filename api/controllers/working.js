const Works = require("../models/works");
const { errorHandler } = require("../utils/error");

const createWorking = async (req, res, next) => {
  const { date, name, duration } = req.body;

  if ((!date, !name, !duration)) {
    return next(errorHandler(400, "Please fill in all field."));
  }

  if (!typeof name === "string") {
    return next(errorHandler(400, "Name must be a string!"));
  }

  if (duration <= 0) {
    return next(errorHandler(400, "Please enter a positive number."));
  }
  // const worksDate = new Date(date).toISOString;
  const newWorks = new Works({
    date: new Date(date).toISOString(),
    name,
    duration,
    userId: req.user.id,
  });

  try {
    await newWorks.save();

    res.status(201).json("Post process successful");
  } catch (error) {
    next(error);
  }
};

const searchWorking = async (req, res, next) => {
  const date = req.params.query;

  if (!date) {
    return next(errorHandler(400, "Please fill in all field."));
  }

  let results;
  //If the incoming request is the month
  if (date.length === 7) {
    const [year, month] = date.split("-");

    results = await Works.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: {
            $gte: new Date(year, month - 1, 1),
            $lt: new Date(year, month, 1),
          },
        },
      },
      {
        $group: {
          _id: "$name",
          duration: { $sum: "$duration" },
          date: { $first: "$date" },
        },
      },
      {
        $project: {
          name: "$_id",
          date: "$date",
          duration: "$duration",
          _id: 0,
        },
      },
    ]);

    //If the incoming request is the all date
  } else if (date.length > 7) {
    const searchAllDate = new Date(date);

    const startOfDay = new Date(searchAllDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchAllDate.setHours(23, 59, 59, 999));

    results = await Works.find({
      userId: req.user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
  }

  if (results.length < 1) {
    return next(errorHandler(404, "There is no study on this date"));
  }

  res.status(200).json(results);
};

const comparisonWorking = async (req, res, next) => {
  const name = req.params.query;

  if (!name) {
    return next(errorHandler(400, "Please enter a work."));
  }

  const results = await Works.aggregate([
    {
      $match: {
        userId: req.user._id,

        name: name,
      },
    },

    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalDuration: { $sum: "$duration" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: {
          $arrayElemAt: [
            [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            { $subtract: ["$_id.month", 1] },
          ],
        },
        totalDuration: 1,
      },
    },
  ]);

  if (results.length === 0) {
    return next(errorHandler(404, "No works found for the given name."));
  }

  if (results) {
    res.status(200).json(results);
  }
};

module.exports = {
  createWorking,
  searchWorking,
  comparisonWorking,
};
