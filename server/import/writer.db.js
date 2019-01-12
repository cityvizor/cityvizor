const async = require("async");
const EventEmitter = require("events");

const Budget = require("../models/budget");
const Event = require("../models/event");
const Counterparty = require("../models/counterparty");
const Payment = require("../models/payment");

class ImportWriter extends EventEmitter{
  
  constructor(etl){
    super();
    this.etl = etl;
  }
  
  save(data,cb){
    
    var tasks = [
      cb => this.clear(cb),
      cb => this.saveBudget(data.budget,cb),
      cb => this.saveEvents(data.events,cb),
      cb => this.saveCounterparties(data.counterparties,cb),
      cb => this.savePayments(data.payments,cb),
    ];
    
    async.series(tasks,cb);
  }
  
  clear(cb){
    
    var etlId = this.etl._id;

    var tasks = [
      cb => Budget.remove({ etl: etlId },cb),
      cb => Counterparty.remove({ etl: etlId },cb),
      cb => Event.remove({ etl: etlId },cb),
      cb => Payment.remove({ etl: etlId },cb)
    ];
    
    async.parallel(tasks,cb)
    
  }
  
  saveBudget(budget,cb){
    return Budget.create(budget,cb);
  }
  
  saveEvents(events,cb){
    return Event.insertMany(events,cb);
  }
  
  saveCounterparties(counterparties,cb){
    return Counterparty.insertMany(counterparties,cb);
  }
  
  savePayments(payments,cb){
    return Payment.insertMany(payments,cb);
  }
  
}

module.exports = ImportWriter;