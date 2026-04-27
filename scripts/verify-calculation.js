
const price = 1750;
const discountAmount = 751;
const offerStatus = 1;

let discountPercentage = 0;
if (offerStatus === 1 && price > 0) {
    discountPercentage = (discountAmount / price) * 100;
    discountPercentage = Math.round(discountPercentage * 100) / 100;
}

console.log(`Original Price: ${price}`);
console.log(`Discount Amount: ${discountAmount}`);
console.log(`Calculated Discount %: ${discountPercentage}`);

// Simulate calculateDiscount from utils.ts
function calculateDiscount(price, discount) {
    const afterDiscount = Number((price - price * (discount / 100)).toFixed(2));
    return afterDiscount;
}

const finalPrice = calculateDiscount(price, discountPercentage);
console.log(`Final Price via calculateDiscount: ${finalPrice}`);

const expectedPrice = price - discountAmount;
console.log(`Expected Price (Price - Amount): ${expectedPrice}`);

const diff = Math.abs(finalPrice - expectedPrice);
if (diff < 1) {
    console.log("SUCCESS: Calculation matches expected amount within rounding error.");
} else {
    console.log("FAILURE: Calculation mismatch.");
}
