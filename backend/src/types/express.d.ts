import { Request } from "express";

export interface AuthRequest extends Request {
    user?: any; // Adjust the type to match your user object
}
