import { Router, Request, Response, NextFunction } from 'express';

// Api methods wrapper
export function apiMethod(innerFunction) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(innerFunction(req))
        .then(result => {
                console.log(result);
                res.json(result);
        }, (err) => {
            console.error(err.stack);
            res.status(err.status || 500);
            res.json(err);
        });
    };
}