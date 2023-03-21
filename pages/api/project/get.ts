import excuteQuery from '../../../lib/db';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  excuteQuery({
    query: `SELECT * FROM projects`,
  }).then((queryResults) => {
    res.status(200).json(queryResults[0])
  });
}