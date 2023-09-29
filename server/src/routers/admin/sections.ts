import express, { Request, Response } from 'express';
import acl from 'express-dynacl';
import { db } from '../../db';
import { SectionRecord } from '../../schema/database/section';

const router = express.Router();

export const SectionRouter = router;

// LIST
router.get('/', acl('options:read'), async (req: Request, res: Response) => {
    try {
        const data = await db<SectionRecord>('app.sections').orderBy('orderOnLanding')

        res.json(data ?? []);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : err });
    }
});

// READ
router.get(
    '/:id',
    acl('options:read'),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const data = await db<SectionRecord>('app.sections')
                .where('sectionId', req.params.id)
                .first();

            if (data) {
                res.json(data);
            } else {
                res.sendStatus(404);
            }
        } catch (err) {
            res.status(500).json({ error: err instanceof Error ? err.message : err });
        }
    }
);

// CREATE
router.post('/', acl('options:write'), async (req: Request, res: Response) => {
    try {
        const body: SectionRecord = req.body;
        if(!body){
            res.status(400).json({error: "Invalid 'selection' request."});
        }
        console.log("$$$$$$$$$$$$$$ HERE")

        const [id] = await db('app.sections').insert(body, [
            'sectionId',
          ]);

        console.log("$$$$$$$$$$$$$$ HERE2")
        res.status(201).json(id);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : err });
    }
});

// UPDATE
router.put(
    '/:id',
    acl('options:write'),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            const body: Partial<SectionRecord> = req.body;

            await db('app.sections')
                .where('sectionId', req.params.id)
                .update(body);

            res.sendStatus(200);
        } catch (err) {
            res.status(500).json({ error: err instanceof Error ? err.message : err });
        }
    }
);

// DELETE
router.delete(
    '/:id',
    acl('options:write'),
    async (req: Request<{ id: string }>, res: Response) => {
        try {
            await db('app.sections')
                .where({ sectionId: req.params.id })
                .delete();

            res.sendStatus(204);
        } catch (err) {
            res.status(500).json({ error: err instanceof Error ? err.message : err });
        }
    }
);