const Scheme = require('./scheme-model');

/*
  If `scheme_id` does not exist in the database:
  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  try {
    const schemeId = await Scheme.findById(req.params.scheme_id);
    if (schemeId) {
      req.scheme = schemeId;
      next();
    } else {
      res.status(404).json({
        message: `scheme with scheme_id ${schemeId.id} not found`,
      });
    }
  } catch (err) {
    next(err);
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:
  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  if (
    !req.body.scheme_name ||
    !req.body.scheme_name !== 'string' ||
    !req.body.scheme_name === ''
  ) {
    res.status(400).json({
      message: 'invalid scheme_name',
    });
  }
  next();
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:
  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  return (req, res, next) => {
    if (!req.body.instructions) {
      return res.status(400).json({
        message: 'invalid step',
      });
    } else {
      if (
        typeof req.body.instructions !== 'string' ||
        req.body.instructions === ''
      ) {
        return res.status(400).json({
          message: 'invalid step',
        });
      } else if (
        typeof req.body.step_number !== 'number' ||
        req.body.step_number < 1
      ) {
        return res.status(400).json({
          message: 'invalid step',
        });
      } else {
        next();
      }
    }
  };
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
