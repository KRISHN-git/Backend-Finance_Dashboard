const FinancialRecord = require("../models/FinancialRecord");
const { successResponse, errorResponse } = require("../utils/response");

exports.createRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.create({
      ...req.body,
      createdBy: req.user._id,
    });
    return successResponse(res, 201, "Record created.", record);
  } catch (error) {
    return errorResponse(res, 500, "Server error.", error.message);
  }
};

exports.getRecords = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isDeleted: false };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const records = await FinancialRecord.find(filter)
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await FinancialRecord.countDocuments(filter);

    return successResponse(res, 200, "Records fetched.", {
      records,
      pagination: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return errorResponse(res, 500, "Server error.", error.message);
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!record) return errorResponse(res, 404, "Record not found.");
    return successResponse(res, 200, "Record updated.", record);
  } catch (error) {
    return errorResponse(res, 500, "Server error.", error.message);
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true },
    );
    if (!record) return errorResponse(res, 404, "Record not found.");
    return successResponse(res, 200, "Record deleted.", null);
  } catch (error) {
    return errorResponse(res, 500, "Server error.", error.message);
  }
};

exports.getRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOne({ _id: req.params.id, isDeleted: false });
    if (!record) return errorResponse(res, 404, 'Record not found.');
    return successResponse(res, 200, 'Record fetched.', record);
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};
