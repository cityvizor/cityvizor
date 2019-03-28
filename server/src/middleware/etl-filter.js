var ETL = require("../models/etl");

module.exports = function(query){

  return function(req, res, next){
    
    if(req.params && req.params.profile) query.profile = req.params.profile;

    ETL.find(query)
      .then(etls => {
        req.etls = etls.map(etl => etl._id);
        next();
      })
      .catch(err => next(err));
  };
  
};