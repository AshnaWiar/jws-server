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
    ENOENT: 'The file was not found at. Please verify the file exists and the path is correct.',
    EACCES: 'Permission denied when accessing the file. Please check your access rights and try again.',
    EISDIR: 'Expected a file but found a directory. Please provide a valid file path.',
    EMFILE: 'Too many files are open in the system. Please close some applications and try again.',
    ENAMETOOLONG: 'The file path is too long. Please shorten the path and try again.',
    EBADF: 'An invalid file descriptor was used while accessing. This might be a system error.',
    ENOTDIR: 'A part of the path is not a directory. Please verify the path is correct.',
    EPERM: 'Operation not permitted. Please check your permissions.',
    UNKNOWN: 'An unknown error occurred while accessing. Please try again or contact support.',
  };

  // Fallback message if code is unrecognized
  return messages[errorCode] || `An unexpected error (${errorCode}) occurred while accessing "${prettyPath}". Please try again.`;
}

function truncatePath(filePath: string, maxLength = 40): string {
  const prettyPath = path.resolve(filePath).replace(/\\/g, '/'); // Normalize slashes for consistency

  if (prettyPath.length <= maxLength) return prettyPath;

  // Split the path by '/' so we can keep start and end separately
  const parts = prettyPath.split('/');

  if (parts.length < 3) {
    // Not enough parts to truncate nicely, just truncate from start
    return prettyPath.slice(0, maxLength - 3) + '...';
  }

  const start = parts.slice(0, 2).join('/'); // e.g. 'C:/Users' or '/home/user'
  const end = parts.slice(-2).join('/');     // last two folders/files

  const truncated = `${start}/.../${end}`;

  // If truncated is still too long, fallback to simple truncate at the end
  if (truncated.length > maxLength) {
    return '...' + prettyPath.slice(prettyPath.length - maxLength + 3);
  }

  return truncated;
}

