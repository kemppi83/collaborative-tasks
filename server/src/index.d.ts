// Add user to the Request object through Declaration Merging
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
declare namespace Express {
  export interface Request {
    user?: admin.auth.DecodedIdToken
  }
}
