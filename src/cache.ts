import NodeCache = require("node-cache");
// import { Request, Response, NextFunction } from "express";

export const dbCache = new NodeCache({ stdTTL: 60 * 60 * 5 }); // cache images for 5 hours

// TODO: Write reusable cache middleware that can be used across all routes.

// export const cacheDbData = (
//   key: string,
//   queryFn: (req: any) => Promise<any>,
// ) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const cachedData = dbCache.get(key);
//       if (cachedData) {
//         console.log("Cache Hit");
//         res.locals.cachedData = cachedData;
//         return next();
//       }
//       console.log("Cache Miss");
//       const freshData = await queryFn(req);
//       dbCache.set(key, freshData);
//       res.locals.cachedData = freshData;
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };
