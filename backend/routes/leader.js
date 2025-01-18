const express = require("express");
const { statusCodes } = require("../lib/types/statusCodes.js");
const { default: PrismaClientManager } = require("../lib/pgConnect.js");
const prisma = PrismaClientManager.getInstance().getPrismaClient();
const leaderRouter = express.Router();
const fs = require("fs");
const path = require("path");
const templatePath = path.join(__dirname, "../html_content/org_approved.html");
const orgTemplate = fs.readFileSync(templatePath, "utf-8");
const officialEmail = process.env.ARCHITECT_EMAIL;
const emailAccessToken = process.env.EMAIL_ACCESS_TOKEN;
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: officialEmail,
    pass: emailAccessToken,
  },
});

async function sendOrganisationApprovedMail(org, inviteCode, email) {
  let htmlContent = orgTemplate;
  htmlContent = htmlContent.replace("{{ORG}}", org);
  htmlContent = htmlContent.replace("{{INVITE_CODE}}", inviteCode);
  htmlContent = htmlContent.replace(
    "[INSERT_LOGIN_URL]",
    process.env.MAIN_WEBSITE_URL + "/signin"
  );

  const receiver = {
    from: officialEmail,
    to: email,
    subject: "Organsiation Approved !!",
    html: htmlContent,
  };

  await transport.sendMail(receiver);
}

// Helper function to generate a 6-character invite code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Approve organisation endpoint
leaderRouter.post("/approve_org", async (req, res) => {
  if (!req.body) {
    return res.json({
      status: statusCodes.BAD_REQUEST,
      message: "Request body is missing",
    });
  }
  console.log(req.body);
  const { organisationId, organisationName } = req.body;

  // Ensure at least one filter (ID or name) is provided
  if (!organisationId && !organisationName) {
    return res.json({
      status: statusCodes.BAD_REQUEST,
      message: "Organisation ID or Organisation Name is required.",
    });
  }

  try {
    // Build the where clause dynamically based on the provided filter
    let whereClause = {};
    if (organisationId) {
      whereClause = { id: organisationId };
    } else if (organisationName) {
      whereClause = { name: organisationName };
    }

    // Fetch the organisation by ID or Name
    const organisation = await prisma.organisation.findFirst({
      where: whereClause,
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
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
      where: { id: organisation.id },
      data: {
        approved: true,
        invite_code: inviteCode,
      },
    });

    // Update the owner's organisation ID
    if (updatedOrganisation.ownerId) {
      await prisma.user.update({
        where: { id: updatedOrganisation.ownerId },
        data: { orgId: organisation.id, role: "admin" },
      });
    }

    await sendOrganisationApprovedMail(
      organisation.name,
      inviteCode,
      organisation.owner.email
    );

    return res.json({
      status: statusCodes.OK,
      message: "Organisation approved successfully.",
      data: {
        organisationId: updatedOrganisation.id,
        inviteCode: updatedOrganisation.invite_code,
      },
    });
  } catch (error) {
    console.log(error);
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
  } 
  catch (error) {
    console.error(error);
    return res.json({
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message: "An error occurred while deleting the organisation.",
    });
  }
});

module.exports = { leaderRouter };
