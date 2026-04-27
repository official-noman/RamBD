import { ceil } from "lodash";
import { differenceInMinutes } from "date-fns";
import { themeGet } from "@styled-system/theme-get";
import emotionIsPropValid from "@emotion/is-prop-valid";

export const isValidProp = (prop: string) => emotionIsPropValid(prop);

export const getTheme = (query: string, fallback?: string) => themeGet(query, fallback);

// CONVERT HEX TO RGB COLOR
export const convertHexToRGB = (hex: string) => {
  // check if it's a rgba

  if (hex.match("rgba")) {
    let triplet = hex.slice(5).split(",").slice(0, -1).join(",");
    return triplet;
  }
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",");
  }
};

// GET THE DATE/TIME DIFFERENCE
export const getDateDifference = (date) => {
  let diff = differenceInMinutes(new Date(), new Date(date));
  if (diff < 60) return diff + " minutes ago";

  diff = ceil(diff / 60);
  if (diff < 24) return `${diff} hour${diff === 0 ? "" : "s"} ago`;

  diff = ceil(diff / 24);
  if (diff < 30) return `${diff} day${diff === 0 ? "" : "s"} ago`;

  diff = ceil(diff / 30);
  if (diff < 12) return `${diff} month${diff === 0 ? "" : "s"} ago`;

  diff = diff / 12;
  return `${diff.toFixed(1)} year${ceil(diff) === 0 ? "" : "s"} ago`;
};

export const renderProductCount = (
  page: number,
  productPerPage: number,
  totalProductLenth: number
) => {
  let startNumber = page * productPerPage;
  let endNumber = (page + 1) * productPerPage;

  if (endNumber > totalProductLenth) endNumber = totalProductLenth;

  return `Showing ${startNumber + 1}-${endNumber} of ${totalProductLenth} products`;
};

/**
 * CALCULATE PRICE WITH PRODUCT DISCOUNT THEN RETURN NEW PRODUCT PRICES
 * @param  price - PRODUCT PRICE
 * @param  discount - DISCOUNT PERCENT
 * @returns - RETURN NEW PRICE
 */


export function calculateDiscount(price: number, discount: number) {
  const afterDiscount = Number((price - discount).toFixed(2));
  return currency(afterDiscount);
}

/**
 * CALCULATE DISCOUNT PERCENTAGE
 * @param  price - PRODUCT PRICE
 * @param  discountAmount - DISCOUNT AMOUNT
 * @returns - RETURN DISCOUNT PERCENTAGE
 */
export function calculateDiscountPercentage(price: number, discountAmount: number) {
  if (price === 0) return 0;
  const percentage = (discountAmount / price) * 100;
  return Math.round(percentage);
}


/**
 * CHANGE THE CURRENCY FORMAT
 * @param  price - PRODUCT PRICE
 * @param  fraction - HOW MANY FRACTION WANT TO SHOW
 * @returns - RETURN PRICE WITH CURRENCY
 */

export function currency(price: number, fraction: number = 2) {
  // const { publicRuntimeConfig } = getConfig();
  // currency: publicRuntimeConfig.currency,

  const formatCurrency = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: fraction,
    minimumFractionDigits: fraction
  });

  return `৳${formatCurrency.format(price)}`;
}

/**
 * Extract specifications from the beginning of a description string
 * Patterns like <p>Key: Value</p> are moved to specs list
 * Returns both specs and the cleaned description
 */
export function extractSpecifications(description: string = "") {
  const specs: { label: string; value: string }[] = [];
  let cleanedDescription = description;

  if (!description) return { specs, cleanedDescription };

  // Regex to match leading <p>Key: Value</p> or <div>Key: Value</div> patterns
  // Using a more flexible regex to handle potential formatting variations
  const pattern = /^(?:<p>|<div>)(.*?):\s*(.*?)(?:<\/p>|<\/div>)/i;

  let iterations = 0;
  const maxIterations = 50; // Safety break

  while (iterations < maxIterations) {
    const match = cleanedDescription.trim().match(pattern);
    if (!match) break;

    const label = match[1].replace(/<[^>]*>/g, "").trim();
    const value = match[2].replace(/<[^>]*>/g, "").trim();

    // Check if it really looks like a key-value or if it's just text with a colon
    if (label.length > 30 || label.includes("<") || value.length > 500) break;

    specs.push({ label, value });
    
    // Remove the matched part including leading whitespace
    const matchIndex = cleanedDescription.indexOf(match[0]);
    cleanedDescription = (cleanedDescription.slice(0, matchIndex) + cleanedDescription.slice(matchIndex + match[0].length)).trim();
    
    // STOP CONDITION: If we reached "Availability", this is usually the end of the specs block
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("availability") || lowerLabel.includes("status")) break;

    iterations++;
  }

  return { specs, cleanedDescription };
}
