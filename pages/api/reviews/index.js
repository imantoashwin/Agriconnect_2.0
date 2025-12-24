import { db } from "../../../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const reviews = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviews.push({
          id: doc.id,
          name: data.userName || "Anonymous",
          productName: data.productName,
          stars: data.rating || 0,
          comments: data.feedback || "No comments",
          createdAt: data.timestamp,
        });
      });

      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
