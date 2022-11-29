const errorHandler = (err, req, res, next) => {
   return res.status(500).json({status:false,msg:'invalid'})
}
export default errorHandler;
