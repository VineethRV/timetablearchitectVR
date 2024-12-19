const express = require("express");
const { checkAuth } = require("../middlewares/checkAuth.js");
const { statusCodes } = require("../lib/types/statusCodes.js");
const { default: PrismaClientManager } = require("../lib/pgConnect.js");
const prisma = PrismaClientManager.getInstance().getPrismaClient();
const orgRouter = express.Router();

// Onboarding endpoint
orgRouter.post("/onboarding", checkAuth, async (req, res) => {
  const { name, sections, teachers, students, depts_list } = req.body;

  // Validate request body
  if (!name || !sections || !teachers || !students || !depts_list) {
    return res.json({
      status: statusCodes.NO_CONTENT,
    });
  }

  try {
    // Check if organisation name already exists
    const existingOrg = await prisma.organisation.findFirst({
      where: { name },
    });

    if (existingOrg) {
      return res.json({
        status: statusCodes.CONFLICT,
      });
    }

    // Check if the user already has an organisation
    const userOrg = await prisma.organisation.findFirst({
      where: { ownerId: req.headers.id },
    });

    if (userOrg) {
      return res.json({
        status: statusCodes.BAD_REQUEST,
      });
    }

    // Create the organisation
    await prisma.organisation.create({
      data: {
        name,
        no_of_sections: sections,
        no_of_teachers: teachers,
        no_of_students: students,
        depts_list: depts_list.join(","),
        approved: false,
        ownerId: req.headers.id,
      },
    });

    return res.json({
      status: statusCodes.CREATED,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      status: statusCodes.INTERNAL_SERVER_ERROR,
    });
  }
});

module.exports = { orgRouter };
