// src/controllers/secteur.controller.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildPagination, buildSearchFilter } from "../helpers/query";

const prisma = new PrismaClient();

export const SecteurController = {
  // CREATE
  async create(req: Request, res: Response) {
    const { name, departementId } = req.body;
    const tenantId = (req as any).tenant.id;

    try {
      const secteur = await prisma.secteur.create({
        data: { name, departementId, tenantId },
      });
      res.status(201).json({
        status: 201,
        isSuccess: true,
        message: "Secteur created successfully !",
        result: secteur,
      });
    } catch (e) {
      res.status(400).json({
        status: 400,
        error: "Error when creating Secteur",
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
        prisma.secteur.findMany({
          where,
          skip,
          take: limit,
          orderBy: { name: "asc" },
        }),
        prisma.secteur.count({ where }),
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
        message: "Error when getting secteur !",
      });
    }
  },

  // UPDATE
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    const tenantId = (req as any).tenant.id;

    try {
      const secteur = await prisma.secteur.update({
        where: { id, tenantId },
        data: { name },
      });
      res.status(201).json({
        status: 201,
        isSuccess: true,
        message: "Secteur updated successfully !",
        result: secteur,
      });
      // res.json(region);
    } catch (e) {
      res.status(404).json({
        status: 404,
        // error: "Secteur introuvable",
        error: " secteur not found with ID:" + id,
      });
    }
  },

  // DELETE
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = (req as any).tenant.id;

    try {
      await prisma.secteur.delete({
        where: { id, tenantId },
      });
      // res.json({ message: "secteur deleted" });
      res.status(200).json({
        status: 200,
        isSuccess: true,
        message: "Secteur deleted successfully with ID:" + id,
      });
    } catch (e) {
      res.status(404).json({
        status: 404,
        error: "Error when deleting secteur",
      });
    }
  },
};
