function payLoadsExist(request, response, next) {
    if (!request.files) return response.json({ status: "error", message: "No file selected." })
    next()
}

module.exports = payLoadsExist