// Construct JSON api response message according to google JSON style guide

// TODO: add JS doc
const successResponse = data => {
    const response = {};
    response.data = data;
    return response;
};

const errorResponse = (code, message) => {
    const response = {};
    response.error = {};
    response.error.code = code;
    response.error.message = message;
    return response;
};

module.exports = {
    successResponse: successResponse,
    errorResponse: errorResponse
};
