import { authHandlers } from './auth';
import { recruitmentsHandlers } from './recruitments';
import { shiftsHandlers } from './shifts';
import { usersHandlers } from './users';

/**
 * すべてのMSWハンドラーを集約
 */
export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...recruitmentsHandlers,
  ...shiftsHandlers,
];
