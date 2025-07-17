/**
 * Determines the user role based on their email address
 * This can be customized based on your school's email patterns
 */
export function getRoleFromEmail(email: string): 'admin' | 'teacher' | 'parent' {
  const emailLower = email.toLowerCase();
  
  // Admin patterns - customize these based on your needs
  const adminPatterns = [
    '@admin.',
    'admin@',
    'principal@',
    'director@',
    'superintendent@'
  ];
  
  // Teacher patterns - customize these based on your needs  
  const teacherPatterns = [
    '@apsk12.org',  // Specific school domain
    '@teacher.',
    'teacher@',
    '@school.',
    '@edu.',
    '.edu',
    'staff@'
  ];
  
  // Check for admin patterns first
  if (adminPatterns.some(pattern => emailLower.includes(pattern))) {
    return 'admin';
  }
  
  // Check for teacher patterns
  if (teacherPatterns.some(pattern => emailLower.includes(pattern))) {
    return 'teacher';
  }
  
  // Default to parent for all other emails
  return 'parent';
}

/**
 * Maps roles to their dashboard URLs
 */
export function getDashboardUrl(role: 'admin' | 'teacher' | 'parent'): string {
  switch (role) {
    case 'admin':
      return '/dashboard/admin';
    case 'teacher':
      return '/teacher';
    case 'parent':
      return '/parent';
    default:
      return '/dashboard';
  }
}
