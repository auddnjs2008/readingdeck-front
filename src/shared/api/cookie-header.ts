const splitSetCookieHeader = (header: string) => {
  return header.split(/,(?=\s*[^;,=\s]+=[^;,]*)/g).map((value) => value.trim());
};

const extractCookiePair = (setCookie: string) => {
  return setCookie.split(";")[0]?.trim() ?? "";
};

export const getSetCookieHeaders = (headers: Headers) => {
  const getSetCookie = headers.getSetCookie?.bind(headers);
  return getSetCookie?.() ?? splitSetCookieHeader(headers.get("set-cookie") ?? "");
};

export const mergeCookieHeader = (
  cookieHeader: string,
  setCookieHeaders: string[]
) => {
  const cookieMap = new Map<string, string>();

  cookieHeader
    .split(";")
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const separatorIndex = pair.indexOf("=");
      if (separatorIndex <= 0) return;
      cookieMap.set(pair.slice(0, separatorIndex), pair.slice(separatorIndex + 1));
    });

  setCookieHeaders
    .map(extractCookiePair)
    .filter(Boolean)
    .forEach((pair) => {
      const separatorIndex = pair.indexOf("=");
      if (separatorIndex <= 0) return;
      cookieMap.set(pair.slice(0, separatorIndex), pair.slice(separatorIndex + 1));
    });

  return Array.from(cookieMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
};
