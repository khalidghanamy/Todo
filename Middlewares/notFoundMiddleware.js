const notFound = (req, res, next) => {
    
   return res.status(404).json({msg:"not found"})
}

export default notFound;