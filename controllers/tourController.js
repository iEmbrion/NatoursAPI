const Tour = require('./../models/tourModel');

exports.getAllTours = (req, res) => {
  //Response using JSend specifications
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (req, res) => {
  const id = +req.params.id;

  const tour = tours.find(tour => tour.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

exports.updateTour = (req, res) => {
  //Excluding update logic for now...
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated Tour here>',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
