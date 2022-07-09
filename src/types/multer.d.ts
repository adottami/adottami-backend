declare namespace Express {
  interface Request {
    files?: Multer.File[];
  }
}
