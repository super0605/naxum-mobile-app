/**
 * Normalizes phone number by removing non-digit characters
 * This helps match phone numbers that may be formatted differently
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Checks if two phone numbers match (after normalization)
 */
export function phonesMatch(phone1: string, phone2: string): boolean {
  const normalized1 = normalizePhone(phone1);
  const normalized2 = normalizePhone(phone2);
  
  // Check if one contains the other (handles cases like +1234567890 vs 1234567890)
  return normalized1 === normalized2 || 
         normalized1.includes(normalized2) || 
         normalized2.includes(normalized1);
}

/**
 * Finds matching status for a phone number from a map of statuses
 */
export function findMatchingStatus(
  phone: string,
  statusMap: Map<string, any>
): any | undefined {
  // Try exact match first
  let status = statusMap.get(phone);
  if (status) return status;
  
  // Try normalized match
  for (const [key, value] of statusMap.entries()) {
    if (phonesMatch(phone, key)) {
      return value;
    }
  }
  
  return undefined;
}

