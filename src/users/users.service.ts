import {CRUD} from '../common/interface/crud.interface'
import {CreateUserDto} from "./dto/create.user.dto";
import UsersDao from "./daos/users.dao";
import {PutUserDto} from "./dto/put.user.dto";
import {PatchUserDto} from "./dto/patch.user.dto";


class UsersService implements CRUD {
    async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource)
    }
    async list(limit: number, page: number) {
        return UsersDao.getUsers(limit, page)
    }
    async putById(id: string, resource: PutUserDto) {
        return UsersDao.updateUserById(id, resource)
    }
    async readById(id: string) {
        return UsersDao.getUserById(id)
    }
    async deleteById(id: string) {
        return UsersDao.removeUserById(id)
    }
    async patchById(id: string, resource: PatchUserDto) {
        return UsersDao.updateUserById(id, resource)
    }
    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email)
    }
    async getUserByEmailWithPassword(email: string) {
        return UsersDao.getUserByEmailWithPassword(email)
    }
}

export default new UsersService()
