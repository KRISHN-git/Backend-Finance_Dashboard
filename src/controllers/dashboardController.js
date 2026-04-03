const FinancialRecord = require('../models/FinancialRecord');
const { successResponse, errorResponse } = require('../utils/response');

exports.getSummary = async (req, res) => {
  try {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const income = result.find(r => r._id === 'income')?.total || 0;
    const expenses = result.find(r => r._id === 'expense')?.total || 0;

    return successResponse(res, 200, 'Summary fetched.', {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};

exports.getCategoryTotals = async (req, res) => {
  try {
    const totals = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return successResponse(res, 200, 'Category totals fetched.', totals);
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};

exports.getMonthlyTrends = async (req, res) => {
  try {
    const trends = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 24 },
    ]);

    return successResponse(res, 200, 'Monthly trends fetched.', trends);
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const records = await FinancialRecord.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name email');
    return successResponse(res, 200, 'Recent activity fetched.', records);
  } catch (error) {
    return errorResponse(res, 500, 'Server error.', error.message);
  }
};