export {};

// Create a type for the roles
export type Roles = "admin" | "editor";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
