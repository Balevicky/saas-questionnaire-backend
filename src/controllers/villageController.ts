// src/controllers/village.controller.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildPagination, buildSearchFilter } from "../helpers/query";

const prisma = new PrismaClient();

export const VillageController = {
  // CREATE
  async create(req: Request, res: Response) {
    const { name, secteurId } = req.body;
    const tenantId = (req as any).tenant.id;

    try {
      const village = await prisma.village.create({
        data: { name, secteurId, tenantId },
      });
      res.status(201).json({
        status: 201,
        isSuccess: true,
        message: "Village created successfully !",
        result: village,
      });
    } catch (e) {
      res.status(400).json({
        status: 400,
        error: "Error when creating Village",
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
        prisma.village.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: "asc" },
        }),
        prisma.village.count({ where }),
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
        message: "Error when getting Village !",
      });
    }
  },

  // UPDATE
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    const tenantId = (req as any).tenant.id;

    try {
      const village = await prisma.village.update({
        where: { id, tenantId },
        data: { name },
      });
      res.status(201).json({
        status: 201,
        isSuccess: true,
        message: "Village updated successfully !",
        result: village,
      });
      // res.json(region);
    } catch (e) {
      res.status(404).json({
        status: 404,
        // error: "Secteur introuvable",
        error: "village not found with ID:" + id,
      });
    }
  },

  // DELETE
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = (req as any).tenant.id;

    try {
      await prisma.village.delete({
        where: { id, tenantId },
      });
      // res.json({ message: "secteur deleted" });
      res.status(200).json({
        status: 200,
        isSuccess: true,
        message: "Village deleted successfully with ID:" + id,
      });
    } catch (e) {
      res.status(404).json({
        status: 404,
        error: "Error when deleting village",
      });
    }
  },
};
