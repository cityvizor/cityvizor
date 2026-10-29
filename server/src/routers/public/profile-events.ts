import express, { Request } from "express";

import { db } from "../../db";
import { getAccountingSources } from "../../accounting-sources";
import { EventRecord, PaymentRecord } from "../../schema";

const router = express.Router({ mergeParams: true });

export const ProfileEventsRouter = router;

router.get(
  "/history/:event",
  async (req: Request<{ profile: string; event: string }>, res) => {
    const sources = await getAccountingSources(req.params.profile);
    const amounts = sources
      .accounting()
      .select("profileId", "year", "event")
      .sum("incomeAmount as incomeAmount")
      .sum("budgetIncomeAmount as budgetIncomeAmount")
      .sum("expenditureAmount as expenditureAmount")
      .sum("budgetExpenditureAmount as budgetExpenditureAmount")
      .whereRaw("event IS NOT NULL")
      .groupBy("profileId", "year", "event");

    const events = await db<EventRecord>("events as e")
      .leftJoin(amounts.as("a"), {
        "a.profileId": "e.profileId",
        "a.year": "e.year",
        "a.event": "e.id",
      })
      .select(
        "e.year",
        "e.id",
        "e.name",
        "a.incomeAmount",
        "a.budgetIncomeAmount",
        "a.expenditureAmount",
        "a.budgetExpenditureAmount"
      )
      .where({ "e.profileId": req.params.profile, "e.id": req.params.event })
      .orderBy("e.year", "desc");

    res.json(events);
  }
);

router.get(
  "/:year/:event",
  async (
    req: Request<{ profile: string; year: string; event: string }>,
    res
  ) => {
    const sources = await getAccountingSources(req.params.profile);
    const qInfo = db<EventRecord>("events")
      .select("id", "name")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year)
      .andWhere("id", req.params.event)
      .first();

    const qTotals = sources
      .accounting()
      .sum("incomeAmount as incomeAmount")
      .sum("budgetIncomeAmount as budgetIncomeAmount")
      .sum("expenditureAmount as expenditureAmount")
      .sum("budgetExpenditureAmount as budgetExpenditureAmount")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year)
      .andWhere("event", req.params.event)
      .first();

    const qItems = sources
      .accounting()
      .select("item AS id")
      .sum("incomeAmount as incomeAmount")
      .sum("budgetIncomeAmount as budgetIncomeAmount")
      .sum("expenditureAmount as expenditureAmount")
      .sum("budgetExpenditureAmount as budgetExpenditureAmount")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year)
      .andWhere("event", req.params.event)
      .groupBy("item");

    const qParagraphs = sources
      .accounting()
      .select("paragraph AS id")
      .sum("incomeAmount as incomeAmount")
      .sum("budgetIncomeAmount as budgetIncomeAmount")
      .sum("expenditureAmount as expenditureAmount")
      .sum("budgetExpenditureAmount as budgetExpenditureAmount")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year)
      .andWhere("event", req.params.event)
      .groupBy("paragraph");

    const qPayments = db<PaymentRecord>("payments")
      .where("profileId", req.params.profile)
      .andWhere("year", req.params.year)
      .andWhere("event", req.params.event);

    const [info, totals, items, paragraphs, payments] = await Promise.all([
      qInfo,
      qTotals,
      qItems,
      qParagraphs,
      qPayments,
    ]);

    const event = {
      ...info,
      ...(totals as NonNullable<unknown>),
      items,
      paragraphs,
      payments,
    };

    res.json(event);
  }
);
