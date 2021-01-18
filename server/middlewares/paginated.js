const paginated = (model, populate) => async (req, res, next) => {
    let query;
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    const total = await model.countDocuments(query);

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    query = query.skip(startIndex).limit(limit);
    if (populate) {
        query = query.populate(populate);
    }

    const results = await query;

    const totalPages = Math.ceil(total / limit);
    // Pagination result
    const pagination = {};
    pagination.pages = totalPages;
    pagination.currentIndex = page;
    pagination.documentCount = total;
    pagination.hasNext = endIndex < total;
    pagination.hasPrev = startIndex > 0;

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    res.paginated = {
        success: true,
        pagination,
        results,
    };

    next();
};

module.exports = paginated;
