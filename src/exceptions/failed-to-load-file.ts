import path from "node:path";
import ErrnoException = NodeJS.ErrnoException;

export class FailedToLoadFile extends Error {

  constructor(filePath: string, originalError: ErrnoException ) {

    const prettyPath = truncatePath(path.resolve(filePath));
    const message = `Failed to read file: "${prettyPath}" reason, `+ getFriendlyErrorMessage(originalError.code as string, prettyPath);

    super(message, {cause: originalError});
    this.name = 'FailedToLoadSpecFileException';
  }
}

function getFriendlyErrorMessage(errorCode: string, filePath: string): string {
  const prettyPath = path.resolve(filePath);

  const messages: Record<string, string> = {
    ENOENT: 'The file was not found. Please verify the file exists and the path is correct.',
    EACCES: 'Permission denied when accessing the file. Please check your access rights and try again.',
    EISDIR: 'Expected a file but found a directory. Please provide a valid file path.',
    ENAMETOOLONG: 'The file path is too long. Please shorten the path and try again.',
    ENOTDIR: 'A part of the path is not a directory. Please verify the path is correct.',
    EPERM: 'Operation not permitted. Please check your permissions.',
    UNKNOWN: 'An unknown error occurred while accessing the file. Please try again or contact support.',
  };

  return messages[errorCode] || `An unexpected error (${errorCode}) occurred while accessing "${prettyPath}". Please try again.`;
}

function truncatePath(filePath: string, maxLength = 40): string {
  // Normalize slashes for consistency
  const prettyPath = path.resolve(filePath).replace(/\\/g, '/');

  if (prettyPath.length <= maxLength) return prettyPath;

  // Split the path by '/' so we can keep start and end separately
  const parts = prettyPath.split('/');

  if (parts.length < 3) {
    // Not enough parts to truncate nicely, just truncate from start
    return prettyPath.slice(0, maxLength - 3) + '...';
  }

  // e.g. 'C:/Users' or '/home/user'
  const start = parts.slice(0, 2).join('/');
  // last two folders/files
  const end = parts.slice(-2).join('/');

  return `${start}/.../${end}`;
}

