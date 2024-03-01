import { Request, Response } from "express";
import { QueryFailedError } from "typeorm";

import ControllerException, { handle_controller_errors } from "../utils/ControllerException";
import database from "../database";
import Equipment from "../entities/Equipment";
import { isSessionAdmin, isSessionConnected } from "../utils/Session";


export async function list(req: Request, res: Response) {
  try {
    if (!await isSessionConnected(req)) {
      throw ControllerException.UNAUTHORIZED;
    }
    
    let equipments = database.getRepository(Equipment);
    let equipment_names = (await equipments.find({ select: ["name"] })).map(equipment => equipment.name);

    res.status(200).send(equipment_names);
  } catch (err) {
    handle_controller_errors(res, err);
  }
}

export async function create(req: Request, res: Response) {
  try {
    if (!await isSessionAdmin(req)) {
      throw ControllerException.UNAUTHORIZED;
    }

    const { name } = req.body;

    if (typeof name != "string") {
      throw ControllerException.MALFORMED_REQUEST;
    }

    try {
      await database.getRepository(Equipment).save({ name });
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code == "23505") {
        throw ControllerException.CONFLICT;
      }

      throw err;
    }

    res.sendStatus(201);
  } catch (err) {
    handle_controller_errors(res, err);
  }
}

export async function modify(req: Request, res: Response) {
  try {
    if (!await isSessionAdmin(req)) {
      throw new ControllerException(401);
    }

    const {
      name,
      new_name,
    } = req.body;

    if (
      typeof name != "string" ||
      typeof new_name != "string"
    ) {
      throw new ControllerException(400);
    }

    let result;

    try {
      result = await database.getRepository(Equipment).update({ name }, { name: new_name });
    } catch (err) {
      if (err instanceof QueryFailedError && err.driverError.code == "23505") {
        throw new ControllerException(409);
      }

      throw err;
    }

    if (result.affected == null || result.affected < 1) {
      throw new ControllerException(404);
    }

    res.sendStatus(200);
  } catch (err) {
    handle_controller_errors(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    if (!await isSessionAdmin(req)) {
      throw ControllerException.UNAUTHORIZED;
    }

    const { name } = req.body;

    if (typeof name != "string") {
      throw ControllerException.MALFORMED_REQUEST;
    }

    const result = await database.getRepository(Equipment).delete({ name: name });
    if (result.affected == null || result.affected < 1) {
      throw ControllerException.NOT_FOUND;
    }

    res.sendStatus(200);
  } catch (err) {
    handle_controller_errors(res, err);
  }
}
