import { prisma } from "../login";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Admin ID is required",
      });
    }

    try {
      const admin = await prisma.admin.findFirst({
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

      if (!admin) {
        return res.status(404).json({
          status: "error",
          message: "Admin not found",
        });
      }

      return res.status(200).json({
        status: "success",
        data: admin,
      });
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      return res.status(500).json({
        status: "error",
        message: "Error fetching admin profile",
        data: error.message,
      });
    }
  }

  if (method === "PUT") {
    const { id, profilePicture } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Admin ID is required",
      });
    }

    if (!profilePicture) {
      return res.status(400).json({
        status: "error",
        message: "Profile picture URL is required",
      });
    }

    try {
      const updatedAdmin = await prisma.admin.update({
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
        data: updatedAdmin,
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
