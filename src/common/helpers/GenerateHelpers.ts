import slugify from 'slugify';

import * as fs from 'fs';

// Generate slug
export function generateSlug(input: string): string {
  const slug = slugify(input, {
    replacement: '_',
    remove: undefined,
    lower: true,
    strict: true,
  });

  return slug;
}

export function getImageUrl(imagePath: string): string {
  // read from nestjs app
  const host = process.env.APP_URL;
  return `${host}/${imagePath}`;
}

export const deleteFile = (path: string) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

export const trimAndCapitalize = (str: string): string => {
  // // Trim extra spaces
  // const trimmedStr = str.trim();

  // // Capitalize the first letter of each word
  // const words = trimmedStr.split(" ");
  // const capitalizedWords = words.map(word => {
  //   const firstLetter = word.charAt(0).toUpperCase();
  //   const restOfWord = word.slice(1).toLowerCase();
  //   return firstLetter + restOfWord;
  // });

  // // Join the capitalized words back into a string
  // const capitalizedStr = capitalizedWords.join(" ");

  // return capitalizedStr;

  // Trim extra spaces and replace consecutive spaces with a single space
  const trimmedStr = str.trim().replace(/\s+/g, ' ');

  // Capitalize the first letter of each word
  const capitalizedWords = trimmedStr
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

  // Join the capitalized words back into a string
  const capitalizedStr = capitalizedWords.join(' ');

  return capitalizedStr;
};

// generate random string

export const randomString = (): string => {
  return String(Date.now().toString(36) + Math.random().toString(16)).replace(/\./g, '');
};

// generate sku code base on year and month with 6 digit number
export const generateSku = (countSku: number): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = date.getMonth() + 1;
  // const random = Math.floor(100000 + Math.random() * 900000);
  // const timeStamp = date.getTime(); // 1594590955933
  // convert to 5 digit number
  // Convert the number to a string
  const newCountSku = countSku + 1;
  const numStr = newCountSku.toString();
  // Pad the number with zeros to 5 digits
  const paddedNumStr = numStr.padStart(5, '0');

  const sku = `${month}${year}${paddedNumStr}`;
  return sku;
};

// convert two decimal point number
export const convertTwoDecimal = (number: number): number => {
  return Number.parseFloat(number.toFixed(2));
};
