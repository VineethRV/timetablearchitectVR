const express = require("express");
const { statusCodes } = require("../lib/types/statusCodes.js");
const { default: PrismaClientManager } = require("../lib/pgConnect.js");
const prisma = PrismaClientManager.getInstance().getPrismaClient();
const leaderRouter = express.Router();

// Helper function to generate a 6-character invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Approve organisation endpoint
leaderRouter.post("/approve_org", async (req, res) => {
  const { organisationId } = req.body;

  if (!organisationId) {
    return res.json({
      status: statusCodes.BAD_REQUEST,
      message: "Organisation ID is required.",
    });
  }

  try {
    // Fetch the organisation by ID
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      return res.json({
        status: statusCodes.NOT_FOUND,
        message: "Organisation not found.",
      });
    }

    if (organisation.approved) {
      return res.json({
        status: statusCodes.BAD_REQUEST,
        message: "Organisation is already approved.",
      });
    }

    // Generate a unique 6-character invite code
    const inviteCode = generateInviteCode();

    // Update the organisation to set approved to true and add the invite code
    const updatedOrganisation = await prisma.organisation.update({
      where: { id: organisationId },
      data: {
        approved: true,
        invite_code: inviteCode,
      },
    });

    // Update the owner's organisation ID
    if (updatedOrganisation.ownerId) {
      await prisma.user.update({
        where: { id: updatedOrganisation.ownerId },
        data: { orgId: organisationId, role: "admin" },
      });
    }

    return res.json({
      status: statusCodes.OK,
      message: "Organisation approved successfully.",
      data: {
        organisationId: updatedOrganisation.id,
        inviteCode: updatedOrganisation.invite_code,
      },
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message: "An error occurred while approving the organisation.",
    });
  }
});

leaderRouter.delete("/delete_org", async (req, res) => {
  const { organisationId } = req.body;

  if (!organisationId) {
    return res.json({
      status: statusCodes.BAD_REQUEST,
      message: "Organisation ID is required.",
    });
  }

  try {
    // Check if the organisation exists
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      return res.json({
        status: statusCodes.NOT_FOUND,
        message: "Organisation not found.",
      });
    }

    // Delete the organisation
    await prisma.organisation.delete({
      where: { id: organisationId },
    });

    return res.json({
      status: statusCodes.OK,
      message: "Organisation deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message: "An error occurred while deleting the organisation.",
    });
  }
});

module.exports = { leaderRouter };
