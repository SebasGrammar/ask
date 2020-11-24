const advancedResults = (model, populate) => async (req, res, next) => {
  // Copy req.query
  const queries = { ...req.query };

  // Excluse fields we don't want to be matched in URL
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and remove them from queries
  removeFields.forEach((parameter) => delete queries[parameter]);

  // let queryString = JSON.stringify(req.query).replace(
  //   // https://stackoverflow.com/questions/30967822/when-do-i-use-path-params-vs-query-params-in-a-restful-api
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}`
  // );

  // Create query string
  let queryString = JSON.stringify(queries).replace(
    // https://stackoverflow.com/questions/30967822/when-do-i-use-path-params-vs-query-params-in-a-restful-api
    /\b(gt|gte|lt|lte|in)\b/g, // create operators allowed by mongoose
    (match) => `$${match}`
  );

  // Find resources
  // let query = Bootcamp.find(JSON.parse(queryString));
  let query = model.find(JSON.parse(queryString)); // you can keep adding stuff to the query before awaiting it.

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.replace(/,/g, ' ');
    console.log(query);
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.replace(/,/g, ' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('createdAt');
    // query = query.sort('-order');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit; // where it's going to start
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate); // here, query is equal to query + populate
  }

  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
};

module.exports = advancedResults;
