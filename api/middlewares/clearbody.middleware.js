export function clearBody(req, res, next) {
  delete req.body?.createdAt;
  delete req.body?.updatedAt;
  delete req.body?._id;

  next();
}
