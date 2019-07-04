const EventEmitter = require("events");

const Budget = require("../../models/budget");
const Event = require("../../models/event");
const Counterparty = require("../../models/counterparty");
const Payment = require("../../models/payment");

class ImportWriter extends EventEmitter {

  constructor(etl) {
    super();
    this.etl = etl;
  }

  async save(data) {

    const etlData = {
      etl: this.etl._id,
      profile: this.etl.profile,
      year: this.etl.year
    };

    Object.assign(data.budget, etlData);
    data.events.forEach(item => Object.assign(item, etlData));
    data.counterparties.forEach(item => Object.assign(item, etlData));
    data.payments.forEach(item => Object.assign(item, etlData));

    await this.clear();
    await this.saveBudget(data.budget);
    await this.saveEvents(data.events);
    await this.saveCounterparties(data.counterparties);
    await this.savePayments(data.payments);
  }

  async clear() {

    var etlId = this.etl._id;

    var tasks = [
      Budget.remove({ etl: etlId }),
      Counterparty.remove({ etl: etlId }),
      Event.remove({ etl: etlId }),
      Payment.remove({ etl: etlId })
    ];

    await Promise.all(tasks);

  }

  saveBudget(budget, cb) {
    return Budget.create(budget, cb);
  }

  saveEvents(events, cb) {
    return Event.insertMany(events, cb);
  }

  saveCounterparties(counterparties, cb) {
    return Counterparty.insertMany(counterparties, cb);
  }

  savePayments(payments, cb) {
    return Payment.insertMany(payments, cb);
  }

}

module.exports = ImportWriter;