import { authHandlers } from "./auth";
import { usersHandlers } from "./users";
import { recruitmentsHandlers } from "./recruitments";
import { shiftsHandlers } from "./shifts";

/**
 * すべてのMSWハンドラーを集約
 */
export const handlers = [
	...authHandlers,
	...usersHandlers,
	...recruitmentsHandlers,
	...shiftsHandlers,
];
