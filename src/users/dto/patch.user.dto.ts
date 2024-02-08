import { PutUserDto } from "./put.user.dto";

export interface PatchUserDto extends Partial<PutUserDto> {
    _id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    permissionFlags?: number;
}