import type { ResultSet } from '@libsql/client';

export const takeUniqueOrThrow = <T extends unknown[]>(values: T): T[number] => {
  if (values.length !== 1) {
    throw new Error('Found non unique or inexistent value');
  }
  return values[0];
};

export const oneAffectedOrThrow = (resultSet: ResultSet): void => {
  if (resultSet.rowsAffected === 0) {
    throw new Error('No row affected');
  }
  if (resultSet.rowsAffected > 1) {
    throw new Error('More than one row affected');
  }
};
