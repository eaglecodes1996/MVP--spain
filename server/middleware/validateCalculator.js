/**
 * Validates calculator / code input. Only allows digits and safe chars; code "2012" is special.
 */
export function validateCalculatorInput(value) {
  if (value == null || typeof value !== 'string') return { valid: false, code: null };
  const trimmed = value.trim();
  if (!/^[0-9]+$/.test(trimmed)) return { valid: false, code: null };
  if (trimmed.length > 8) return { valid: false, code: null };
  return { valid: true, code: trimmed === '2012' ? '2012' : null };
}
