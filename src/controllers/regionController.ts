// src/controllers/regionController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildPagination, buildSearchFilter } from "../helpers/query";

const prisma = new PrismaClient();

export const RegionController = {
  // CREATE
  async create(req: Request, res: Response) {
    const { name } = req.body;
    const tenantId = (req as any).tenant.id;

    try {
      const region = await prisma.region.create({
        data: { name, tenantId },
      });
      res.status(201).json({
        status: 201,
        isSuccess: true,
        message: "Région created successfully !",
        result: region,
      });
    } catch (e) {
      res.status(400).json({
        status: 400,
        error: "Error when creating region",
      });
    }
  },

  // LIST + PAGINATION + SEARCH
  async list(req: Request, res: Response) {
    const { skip, limit, page } = buildPagination(req.query);
    const tenantId = (req as any).tenant.id;
    const search = (req as any).query.search;

    try {
      const where: any = {
        tenantId,
        name: buildSearchFilter(search),
      };

      const [data, total] = await Promise.all([
        prisma.region.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: "asc" },
        }),
        prisma.region.count({ where }),
      ]);
      res.status(201).json({
        status: 201,
        isSuccess: true,
        result: data,
        pagination: { page, limit, total },
      });
      // res.json({
      //   data,
      //   pagination: { page, limit, total },
      // });
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "Error when getting Région !",
      });
    }
  },

  // UPDATE
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    const tenantId = (req as any).tenant.id;

    try {
      const region = await prisma.region.update({
        where: { id, tenantId },
        data: { name },
      });
      res.status(201).json({
        status: 201,
        isSuccess: true,
        message: "Région updated successfully !",
        result: region,
      });
      // res.json(region);
    } catch (e) {
      res.status(404).json({
        status: 404,

        error: "RégionDepartement not found with ID:" + id,
      });
    }
  },

  // DELETE
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = (req as any).tenant.id;

    try {
      await prisma.region.delete({
        where: { id, tenantId },
      });
      // res.json({ message: "secteur deleted" });
      res.status(200).json({
        status: 200,
        isSuccess: true,
        message: "Région deleted successfully with ID:" + id,
      });
    } catch (e) {
      res.status(404).json({
        status: 404,
        error: "Error when deleting Région",
      });
    }
  },
};
