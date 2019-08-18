import EventEmitter from "events";

import { db } from "../../db";
import { AccountingRecord, PaymentRecord, EventRecord } from "src/schema";

class ImportWriter extends EventEmitter {

  etl;

  constructor(etl) {
    super();
    this.etl = etl;
  }

  async clear() {

    var tasks = [
      db("accounting").where({ profile_id: this.etl.profile, year: this.etl.year }).delete(),
      db("payments").where({ profile_id: this.etl.profile, year: this.etl.year }).delete(),
      db("events").where({ profile_id: this.etl.profile, year: this.etl.year }).delete()
    ];

    await Promise.all(tasks);
  }

  async writeBalance(balance: AccountingRecord, cb) {
    return db<AccountingRecord>("accounting").insert(balance);
  }

  async writePayment(payment: PaymentRecord, cb) {
    return db<PaymentRecord>("payments").insert(payment);
  }

  async writeEvent(event: EventRecord, cb) {
    return db<EventRecord>("events").insert(event);
  }

}

module.exports = ImportWriter;