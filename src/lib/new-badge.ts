/**
 * A menu item is "new" purely based on data: `new_until` is set and is
 * still in the future. No cron job, timer, or background task is needed —
 * this is re-evaluated on every render using the current time, so the
 * badge disappears on its own once `new_until` passes.
 */
export function isNewItem(newUntil: string | null | undefined): boolean {
  if (!newUntil) return false
  const expiry = new Date(newUntil).getTime()
  if (Number.isNaN(expiry)) return false
  return expiry > Date.now()
}
