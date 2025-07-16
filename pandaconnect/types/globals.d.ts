export {}

// Create a type for the roles
export type Roles = 'admin' | 'teacher' | 'parent'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}
