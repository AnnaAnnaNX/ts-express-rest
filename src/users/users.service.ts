import {CRUD} from '../common/interface/crud.interface'
import {CreateUserDto} from "./create.user.dto";
import UsersDao from "./daos/users.dao";
import {PutUserDto} from "./put.user.dto";
import {PatchUserDto} from "./patch.user.dto";


class UsersService implements CRUD {
    async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource)
    }
    async list(limit: number, page: number) {
        return UsersDao.getUsers()
    }
    async putById(id: string, resource: PutUserDto) {
        return UsersDao.putUserById(id, resource)
    }
    async readById(id: string) {
        return UsersDao.getUserById(id)
    }
    async deleteById(id: string) {
        return UsersDao.removeUserById(id)
    }
    async patchById(id: string, resource: PatchUserDto) {
        return UsersDao.patchUserById(id, resource)
    }
    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email)
    }
}

export default new UsersService()
