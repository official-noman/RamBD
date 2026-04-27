import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Box from "@component/Box";
import Rating from "@component/rating";
import FlexBox from "@component/FlexBox";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import { H2, H5 } from "@component/Typography";
import ProductComment from "./ProductComment";

import api from "@utils/__api__/products";
import { useAppContext } from "@context/app-context";

export default function ProductReview({ reviews = [], slug, model, productId }: { reviews?: any[], slug?: string, model?: string, productId?: string | number }) {
  const router = useRouter();
  const { state } = useAppContext();
  const [localReviews, setLocalReviews] = useState(reviews);

  // Update local reviews if prop changes (e.g. on navigation)
  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const hasReviewed = !!state.user && localReviews.some(r => {
    const reviewClientId = r.client_id || r.customer_id || r.user_id || r.client?.id;
    const currentUserId = state.user?.id || state.user?.client_id;
    return reviewClientId && currentUserId && String(reviewClientId) === String(currentUserId);
  });

  const initialValues = {
    rating: "",
    comment: "",
    date: new Date().toISOString()
  };

  const validationSchema = yup.object().shape({
    rating: yup.number().required("required"),
    comment: yup.string().required("required")
  });

  const handleFormSubmit = async (values: any, { resetForm }: any) => {
    if (!slug || !model) {
      alert("Product information missing, cannot submit review.");
      return;
    }

    try {
      const reviewPayload = {
        rating: Number(values.rating),
        message: values.comment,
        client_id: state.user?.id || 1, // Use verified client_id fallback instead of 42
        pro_id: productId
      };

      const result = await api.postReview(slug, model, reviewPayload);

      // OPTIMISTIC UPDATE: Add the new review to the list immediately
      // MUST match the structure of the API items for correct rendering
      const newReview = {
        rev_rating: reviewPayload.rating,
        rev_details: reviewPayload.message,
        created_at: new Date().toISOString(),
        client_id: state.user?.id, // Ensure ID is present for hasReviewed check
        client: {
          name: state.user?.name || "You (Just now)",
          client_profile_image: state.user?.avatar || null
        }
      };

      setLocalReviews([newReview, ...localReviews]);

      alert("Review submitted successfully!");
      resetForm();

      // Refresh server-side data (though local state handles immediate view)
      router.refresh();
    } catch (error) {
      console.error("Review submission error:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit
  });

  return (
    <div>

      {localReviews && localReviews.map((item, ind) => (
        <ProductComment
          key={ind}
          name={item.client?.name || item.name || "Anonymous"}
          imgUrl={item.client?.client_profile_image ? `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://admin.unicodeconverter.info'}/uploads/client/${item.client.client_profile_image}` : (item.imgUrl || "/assets/images/faces/7.png")}
          rating={item.rev_rating || item.rating || 0} // Default to 0 instead of 5 if data is null/missing
          date={item.created_at || item.date || new Date().toISOString()}
          comment={item.rev_details || item.comment || item.message || "No comment provided."}
        />
      ))}

      {(!localReviews || localReviews.length === 0) && (
        <H5 color="text.muted" mb="20px">No reviews yet. Be the first to review!</H5>
      )}

      {!state.user ? (
        <Box mt="40px" p="30px" backgroundColor="gray.100" borderRadius="8px" textAlign="center">
          <H5 mb="1rem">Please sign in to write a review for this product.</H5>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => router.push(`/login?redirectTo=/pro/${slug}`)}>
            Sign In
          </Button>
        </Box>
      ) : hasReviewed ? (
        <Box mt="40px" p="20px" backgroundColor="gray.100" borderRadius="8px">
          <H5 color="success.main" textAlign="center">
            You have already submitted a review for this product. Thank you!
          </H5>
        </Box>
      ) : (
        <>
          <H2 fontWeight="600" mt="55px" mb="20">
            Write a Review for this product
          </H2>

          <form onSubmit={handleSubmit}>
            <Box mb="20px">
              <FlexBox mb="12px">
                <H5 color="gray.700" mr="6px">
                  Your Rating
                </H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <Rating
                outof={5}
                color="warn"
                size="medium"
                readOnly={false}
                value={parseInt(values.rating) || 0}
                onChange={(value) => setFieldValue("rating", value)}
              />
            </Box>

            <Box mb="24px">
              <FlexBox mb="12px">
                <H5 color="gray.700" mr="6px">
                  Your Review
                </H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <TextArea
                fullwidth
                rows={8}
                name="comment"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.comment || ""}
                placeholder="Write a review here..."
                errorText={touched.comment && errors.comment}
              />
            </Box>

            <Button
              size="small"
              type="submit"
              color="primary"
              variant="contained"
              disabled={!(dirty && isValid)}>
              Submit
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

const commentList = [
  {
    name: "Jannie Schumm",
    imgUrl: "/assets/images/faces/7.png",
    rating: 4.7,
    date: "2021-02-14",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account."
  },
  {
    name: "Joe Kenan",
    imgUrl: "/assets/images/faces/6.png",
    rating: 4.7,
    date: "2019-08-10",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account."
  },
  {
    name: "Jenifer Tulio",
    imgUrl: "/assets/images/faces/8.png",
    rating: 4.7,
    date: "2021-02-05",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account."
  }
];
