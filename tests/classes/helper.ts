/**
 * Delay helper for async actions
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export { delay };
