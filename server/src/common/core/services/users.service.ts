import { Manager } from './../../../data/entities/managers.entity';
import { GetUserByEmailDTO } from './../../../models/user/getUserByEmail.dto';
import { ClientRegisterDTO } from './../../../models/user/client-register.dto';
import { GetUserDTO } from '../../../models/user/get-user.dto';
import { UserLoginDTO } from '../../../models/user/user-login.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../../data/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../../interfaces/jwt-payload';
import { Role } from '../../../data/entities/role.entity';
import { Funds } from '../../../data/entities/funds.entity';
import { RegisterDTO } from '../../../models/user/register.dto';
import { IdDTO } from 'src/models/user/id.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Manager)
    private readonly managersRepository: Repository<Manager>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Funds)
    private readonly fundsRepository: Repository<Funds>,
  ) { }

  async createManager(manager: RegisterDTO): Promise<Manager> {
    const foundManager = await this.managersRepository.findOne({ email: manager.email });
    const foundClient = await this.usersRepository.findOne({ email: manager.email });
    if (foundManager || foundClient) {
      throw new BadRequestException('Email already exist');
    }

    try {
      const managerRole = await this.roleRepository.findOne({ rolename: 'manager' });
      const newManager = await this.managersRepository.create();

      newManager.fullname = manager.fullname;
      newManager.email = manager.email;
      newManager.password = manager.password = await bcrypt.hash(manager.password, 10);
      newManager.dateregistered = new Date();
      newManager.role = managerRole;

      return await this.managersRepository.save(newManager);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createAdmin(admin: RegisterDTO): Promise<User> {
    const foundAdmin = await this.usersRepository.findOne({ email: admin.email });
    const foundManager = await this.managersRepository.findOne({ email: admin.email });
    if (foundAdmin || foundManager) {
      throw new BadRequestException('Email already exist');
    }
    try {
      const role = await this.roleRepository.findOne({ rolename: 'admin' });
      const newAdmin = await this.usersRepository.create();
      newAdmin.fullname = admin.fullname;
      newAdmin.email = admin.email;
      newAdmin.dateregistered = new Date();
      newAdmin.role = role;
      newAdmin.password = admin.password = await bcrypt.hash(admin.password, 10);
      return await this.usersRepository.save(newAdmin);

    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createClient(managerId: string, client: ClientRegisterDTO): Promise<User> {
    const foundClient = await this.usersRepository.findOne({ email: client.email });
    const foundManager = await this.managersRepository.findOne({ email: client.email });
    if (foundClient || foundManager) {
      throw new BadRequestException('Email already exist');
    }

    try {
      const role = await this.roleRepository.findOne({ rolename: 'client' });
      const manager = await this.managersRepository.findOne({ id: managerId });

      const funds = await this.fundsRepository.create();
      funds.currentamount = +client.amount;
      await this.fundsRepository.save(funds);

      const newClient = await this.usersRepository.create();
      newClient.fullname = client.fullname;
      newClient.email = client.email;
      newClient.dateregistered = new Date();
      newClient.role = role;
      newClient.manager = manager;
      newClient.funds = funds;

      return await this.usersRepository.save(newClient);
    } catch (error) {
      throw new BadRequestException('Client cannot be created');
    }
  }

  async validateUser(payload: JwtPayload): Promise<GetUserDTO> {
    const userFound: any = await this.usersRepository.findOne({ where: { email: payload.email } });
    const userFound1: any = await this.managersRepository.findOne({ where: { email: payload.email } });
    return userFound || userFound1;
  }

  async signIn(user: UserLoginDTO): Promise<User | Manager> {
    const userFound: User = await this.usersRepository.findOne({ where: { email: user.email } });
    const userFound1: Manager = await this.managersRepository.findOne({ where: { email: user.email } });
    if (userFound) {
      const result = await bcrypt.compare(user.password, userFound.password);
      if (result) {
        return userFound;
      }
    } else {
      const result1 = await bcrypt.compare(user.password, userFound1.password);
      if (result1) {
        return userFound1;
      }
    }

    return null;
  }

  async getAll() {
    return this.usersRepository.find({});
  }

  async getManager(manager: GetUserByEmailDTO): Promise<Manager> {
    try {
      const foundManager = await this.managersRepository.findOneOrFail({ email: manager.email });
      return foundManager;
    } catch (error) {
      throw new BadRequestException('No such manager');
    }
  }

  async getUsersByRole(role: string): Promise<Manager[] | User[]> {
    try {
      if (role === 'manager') {
        const managers = await this.managersRepository.find({});
        return managers;
      }
      if (role === 'admin') {
        let admins = await this.usersRepository.find();
        admins = admins.filter((user) => user.role.rolename === 'admin');
        return admins;
      }
      if (role === 'client') {
        let client = await this.usersRepository.find();
        client = client.filter((user) => user.role.rolename === 'client');
        return client;
      }
    } catch (error) {
      throw new BadRequestException('No users in the database!');
    }
  }

  async getUser(user: GetUserByEmailDTO): Promise<User> {
    try {
      const foundUser = await this.usersRepository.findOneOrFail({ email: user.email });
      return foundUser;
    } catch (error) {
      throw new BadRequestException('No such user');
    }
  }

  async getClients(id: IdDTO): Promise<{}> {
    try {
      const clients = await this.usersRepository.find({ where: { manager: id } });
      return clients;
    } catch (error) {
      throw new BadRequestException('No such user');
    }
  }

  // // Need info on settings and how will it work
  // async getUserSettings(id: string) {
  //   const user: User = await this.usersRepository.findOne({ id });
  //   return user.settings;
  // }

  // async getAllUsersSettings() {
  //   const users: User[] = await this.usersRepository.find({});
  //   return users;
  // }

  // async updateUserSettings(id: string, settings: any) {
  //   const user: User = await this.usersRepository.findOne({ id });
  //   user.settings = settings;
  // }

  async assignManager(email): Promise<{ message: string }> {
    try {
      const userEmail = email.email;
      const managerEmail = email.manager_email;

      const user: User = await this.usersRepository.findOne({ where: { email: userEmail } });
      if (user.role.rolename !== 'client') {
        throw new BadRequestException('The user is not a client!');
      }
      const manager: Manager = await this.managersRepository.findOne({ where: { email: managerEmail } });

      user.manager = manager;
      this.usersRepository.update({ email: userEmail }, { manager });

      return { message: `Successfully assigned manager ${manager.email} to ${user.email}` };
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async unassignManager(email): Promise<{ message: string }> {
    try {
      const user: User = await this.usersRepository.findOneOrFail({ where: { email: email.email } });
      if (!user.manager) {
        throw new BadRequestException('The user does not have a manager assigned to him!');
      }

      user.manager = null;
      this.usersRepository.update({ email: email.email }, { manager: null });

      return { message: `Successfully unassigned manager from user ${user.email}` };
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async dropManager(email): Promise<{ message: string }> {
    try {
      const manager = await this.managersRepository.findOneOrFail({ where: { email: email.manager_email } });
      const users: User[] = await this.usersRepository.find({ where: { manager } });
      users.forEach(async (user) => {
        const id = user.id;
        user.manager = null;
        await this.usersRepository.update({ id }, { manager: null });
      });

      return { message: `Successfully unassigned all users from manager ${manager.email}` };
    }
    catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
