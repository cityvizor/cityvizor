const { Transform } = require('stream');

class CSVTransformer extends Transform {
  
  constructor(config) {
    super({objectMode:true});
    
    this.config = config;

    this.firstLine = true;
    this.headerMap = {};
    
  }

  _transform(line,encoding,callback){
    
    if(this.firstLine){

      this.firstLine = false;

      try{
        this.headerMap = this.makeHeaderMap(this.config.headerNames,line);
        
        var missingFields = Object.keys(this.headerMap).filter(key => this.headerMap[key] === -1);
        var missingMandatory = missingFields.filter(key => this.config.mandatoryFields.indexOf(key) !== -1);
        
        if(missingFields.length) this.emit("warning","Nenalezena volitelná pole: " + missingFields.map(key => key + "(" + this.config.headerNames[key].join("/") + ")").join(", ") + ".");
        if(missingMandatory.length) throw new Error("Nenalezena povinná pole: " + missingMandatory.map(key => key + "(" + this.config.headerNames[key].join("/") + ")").join(", ") + ".");
        
        callback(null);
      }catch(err){
        callback(err);
      }
    }
    else{
      
      let record = {};
      Object.keys(this.headerMap).forEach(key => record[key] = line[this.headerMap[key]]);
      
      callback(null, record);
    }
  }
  
  makeHeaderMap(headerNames,header){

    var headerMap = {};

    Object.keys(headerNames).forEach(field => {

      let columnNames = headerNames[field];

      let search = columnNames.some(name => {
        headerMap[field] = header.indexOf(name);
        if(headerMap[field] >= 0) return true;
      });

    });

    return headerMap;

  }

}

module.exports = CSVTransformer; 