const MAX_LOG_LINE_LENGTH = 255;

export function isEmpty<T>(value: T): boolean {
  return value === null || value === undefined;
}

export function isNotEmpty<T>(value: T): boolean {
  return !isEmpty(value);
}

export function isDefined<T>(value: T): boolean {
  return value !== undefined;
}

export function isBlank(value: string): boolean {
  return isEmpty(value) || value.trim() === "";
}

export function isNotBlank(value: string): boolean {
  return !isBlank(value);
}

export function undefinedIfBlank(value: string): string | undefined {
  return isBlank(value) ? undefined : value;
}

export function nullIfBlank(value: string): string | null {
  return isBlank(value) ? null : value;
}

export function nullIfUndefined<T>(value: T): T | null {
  return value === undefined ? null : value;
}

export function identity<T>(value: T): T {
  return value;
}

export function ellipsis(text: string, maxlength: number): string {
  return text.length > maxlength - 3
    ? text.substr(0, maxlength - 3) + "..."
    : text;
}

export function shortenForLog(text: string): string {
  return ellipsis(text, MAX_LOG_LINE_LENGTH);
}

export function shortenUuid(id: string): string {
  return id.substr(0, 8);
}
