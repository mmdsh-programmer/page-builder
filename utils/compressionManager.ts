import LZString from "lz-string";

export const compressData = (data: string | object): string => {
  try {
    const jsonString = typeof data === "string" ? data : JSON.stringify(data);
    const compressed = LZString.compressToBase64(jsonString);

    return compressed;
  } catch (error) {
    console.error("Compression failed:", error);
    return typeof data === "string" ? data : JSON.stringify(data);
  }
};

export const decompressData = (compressedData: string): string | object => {
  try {
    const decompressed = LZString.decompressFromBase64(compressedData);

    if (decompressed === null) {
      return compressedData;
    }

    try {
      return JSON.parse(decompressed);
    } catch {
      return decompressed;
    }
  } catch (error) {
    console.error("Decompression failed:", error);
    return compressedData;
  }
};

export const isCompressed = (data: string): boolean => {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return (
    base64Regex.test(data) &&
    data.length > 0 &&
    !data.includes("{") &&
    !data.includes('"')
  );
};

export const safeDecompress = (data: string): string | object => {
  if (isCompressed(data)) {
    return decompressData(data);
  }

  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};
