import moment from 'moment';
import type { NextApiRequest, NextApiResponse } from 'next'
import excuteQuery from '../../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  excuteQuery({
    query: 'INSERT INTO projects (type, name, description, createdDate, createdUser, lastModifiedDate, lastModifiedUser) VALUES (?, ?, ?, ?, ?, ?, ?)',
    values: [
      'game',
      req.body.name,
      '',
      moment().format('YYYY-MM-DD HH:mm:ss'),
      0,
      moment().format('YYYY-MM-DD HH:mm:ss'),
      0
    ],
  }).then((queryResults) => {
    res.status(200).json(queryResults[0])
  }).catch((error) => {
    res.status(500)
  });
}