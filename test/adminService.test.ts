import {createUserService} from "../src/services/adminService";
import { UserRepository } from "../src/repositories/userRepository";


jest.mock("../src/repositories/userRepository");

UserRepository.findByEmail = jest.fn().mockResolvedValue(null);
UserRepository.create = jest.fn().mockResolvedValue({
  id: "1",
  email: "john@example.com"
});

describe('createUserService', () => {

    test('should create a new user: ', async() => {
    const name = "John Doe";
    const email = "john@example.com";
    const password = "pass123";
    const role = "user";
   
    const actual = await createUserService(name, email, password, role);
     expect(actual).toHaveProperty("email", email);
    })
})