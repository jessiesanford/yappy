import excuteQuery from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('THIS IS THE ID:', req.body.id);
  excuteQuery({
    query: `DELETE FROM projects WHERE id = ?`,
    values: [
      req.body.id,
    ]
  }).then((queryResults) => {
    res.status(200).json(queryResults[0])
  }).catch((error) => {
    res.status(500)
  });
}