declare namespace Express {
  interface User extends Partial<import('../../common/types/types').User> { }

  interface Request {
    user?: User;
  }
}
