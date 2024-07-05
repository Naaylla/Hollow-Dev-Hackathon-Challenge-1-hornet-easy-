function payLoadsExist(request, response, next) {
    if (!request.files) return response.json({ status: "error", message: "Missing Files" })
    next()
}

module.exports = payLoadsExist