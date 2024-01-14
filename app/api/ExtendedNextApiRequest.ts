import { NextApiRequest, NextApiResponse } from "next";

export interface ExtendedNextApiRequest extends NextApiRequest {
  json: () => Promise<any>;
}
