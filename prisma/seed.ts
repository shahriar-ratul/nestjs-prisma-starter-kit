import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { adminData } from "./seedData/admin";
import { permissionData } from "./seedData/permission";
import { roleData } from "./seedData/role";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  for (const permissionItem of permissionData) {
    const { slug, group, name } = permissionItem;

    await prisma.permission.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        group,
        name,
      },
    });
    console.log(`Created permission with slug: ${slug}`);
  }

  for (const roleItem of roleData) {
    const { name, slug, description, percentage } = roleItem;

    const roleExists = await prisma.role.findFirst({
      where: {
        slug,
      },
    });

    if (!roleExists) {
      const role = await prisma.role.create({
        data: {
          name,
          slug,
          description,
          percentage: percentage || 0,
        },
      });

      if (role.slug === "superadmin") {
        const permissions = await prisma.permission.findMany({
          where: {
            NOT: {
              slug: {
                in: [
                  "streamer.dashboard",
                  "user.dashboard",
                  "marketplace.view",
                  "streamer-discount.view",
                  "streamer-discount.create",
                  "streamer-discount.delete",
                  "consign-to.approve",
                ],
              },
            },
          },
        });

        const permissionIds = permissions.map((permission) => permission.id);

        Promise.all(
          permissionIds.map(async (permissionId) => {
            await prisma.permissionRole.create({
              data: {
                roleId: role.id,
                permissionId: permissionId,
              },
            });
          }),
        );
      }

      console.log(`Created role with slug: ${slug}`);
    } else {
      console.log(`Role with slug: ${slug} already exists`);
    }
  }
  console.log("Created roles and permissions");

  //
  for (const adminItem of adminData) {
    const { username, email, password, isActive } = adminItem;

    const hash = await bcrypt.hash(password, 15);

    const admin = await prisma.admin.upsert({
      where: { email, username },
      update: {},
      create: {
        username,
        email,
        password: hash,
        isActive,
      },
    });

    if (admin.username === "super_admin") {
      const roles = await prisma.role.findMany({
        where: {
          NOT: {
            slug: {
              in: ["admin", "user"],
            },
          },
        },
      });
      const roleIds = roles.map((role) => role.id);

      Promise.all(
        roleIds.map(async (roleId) => {
          await prisma.adminRole.create({
            data: {
              adminId: admin.id,
              roleId: roleId,
            },
          });
        }),
      );
    }

    if (admin.username === "admin") {
      const adminRole = await prisma.role.findFirst({
        where: {
          slug: "admin",
        },
      });

      if (adminRole) {
        await prisma.adminRole.create({
          data: {
            adminId: admin.id,
            roleId: adminRole.id,
          },
        });
      }
    }

    if (admin.username === "user") {
      const userRole = await prisma.role.findFirst({
        where: {
          slug: "user",
        },
      });

      if (userRole) {
        await prisma.adminRole.create({
          data: {
            adminId: admin.id,
            roleId: userRole.id,
          },
        });
      }
    }

    console.log(`Created admin with email: ${email}`);
  }

  // Create 100 users

  for (let i = 0; i < 10; i++) {
    const user = await prisma.admin.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: await bcrypt.hash("password", 15),
        isActive: true,
      },
    });

    const userRole = await prisma.role.findFirst({
      where: {
        slug: "user",
      },
    });

    if (userRole) {
      await prisma.adminRole.create({
        data: {
          adminId: user.id,
          roleId: userRole.id,
        },
      });
    }

    // make
    console.log(`Created user role with email: ${user.email}`);
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
