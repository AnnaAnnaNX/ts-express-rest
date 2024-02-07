import { PutUserDto } from "./put.user.dto";

export interface PatchUserDto extends Partial<PutUserDto> {
    id: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    permissionLevel?: number;
}