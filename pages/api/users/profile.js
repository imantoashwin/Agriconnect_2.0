import { prisma } from "../../login";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    try {
      const user = await prisma.user.findFirst({
        where: { id },
        select: {
          id: true,
          email: true,
          user_name: true,
          mobile: true,
          profilePicture: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({
        status: "error",
        message: "Error fetching user profile",
        data: error.message,
      });
    }
  }

  if (method === "PUT") {
    const { id, profilePicture } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "User ID is required",
      });
    }

    if (!profilePicture) {
      return res.status(400).json({
        status: "error",
        message: "Profile picture URL is required",
      });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          profilePicture,
          updated_at: new Date(),
        },
        select: {
          id: true,
          email: true,
          user_name: true,
          mobile: true,
          profilePicture: true,
          updated_at: true,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Profile picture updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      return res.status(500).json({
        status: "error",
        message: "Error updating profile picture",
        data: error.message,
      });
    }
  }

  return res.status(405).json({
    status: "error",
    message: "Method not allowed",
  });
}
