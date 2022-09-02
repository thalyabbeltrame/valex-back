import { connection } from '../databases/postgres';
import { Business } from '../utils/interfaces/businessInterface';

export async function findById(id: number) {
  const result = await connection.query<Business, [number]>(
    'SELECT * FROM businesses WHERE id=$1',
    [id]
  );

  return result.rows[0];
}
