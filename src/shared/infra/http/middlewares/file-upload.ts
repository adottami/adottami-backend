import { RequestHandler } from 'express';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

interface FileUploadOptions {
  fieldName: string;
  fileName?: (file: Express.Multer.File) => string;
  mimeTypes?: string[];
  limits?: {
    maxFiles?: number;
    maxFileSizeInBytes?: number;
  };
}

function fileUpload(options: FileUploadOptions): RequestHandler {
  const { fieldName, fileName = () => uuid(), mimeTypes, limits } = options;

  const upload = multer({
    storage: multer.diskStorage({
      filename(_request, file, callback) {
        callback(null, fileName(file));
      },
    }),

    fileFilter(_request, file, callback) {
      if (mimeTypes === undefined || mimeTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error(`Invalid file type: ${file.mimetype} (${file.originalname}).`));
      }
    },

    limits: {
      files: limits?.maxFiles,
      fileSize: limits?.maxFileSizeInBytes,
    },
  });

  return upload.array(fieldName);
}

export default fileUpload;
