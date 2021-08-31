import {Schema} from "joi";
import {Request, Response, NextFunction} from "express";

export function validateBody(schema: Schema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);
        } catch (err) {
            return res.send(err).status(400);
        }

        next();
    };
}
