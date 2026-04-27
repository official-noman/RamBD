import Typography, { H3 } from "@component/Typography";
import { extractSpecifications } from "@utils/utils";

export default function ProductDescription({ description }: { description?: string }) {
  const { cleanedDescription } = extractSpecifications(description || "");

  if (!cleanedDescription) {
    return (
      <div>
        <H3 mb="1rem">Description:</H3>
        <Typography>No description available for this product.</Typography>
      </div>
    );
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: cleanedDescription }} />
  );
}
