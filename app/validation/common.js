const Joi = require('joi');
const constant = require('../constant/cowshed');

const search = Joi.string().trim().min(constant.minValue).optional();

const page = Joi.number().min(constant.minValue).default(constant.minValue);

const size = Joi.number().min(constant.minValue).default(constant.maxValue).optional();

const sort = Joi.string().trim().optional().default(constant.defaultSort);

const sortOrder = Joi.string().trim().valid(constant.orderingKeys.ASC, constant.orderingKeys.DESC).optional().default(constant.orderingKeys.DESC);

const id = Joi.string().trim().hex().length(24).required();

const _id = Joi.string().trim().hex().length(24);

const list = Joi.object({
  search,
  page,
  size,
  sort,
  sortOrder
});

module.exports = { search, page, size, sort, sortOrder, list, id, _id };
