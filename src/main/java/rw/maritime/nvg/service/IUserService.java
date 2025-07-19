package rw.maritime.nvg.service;

import rw.maritime.nvg.model.User;
import java.util.List;

public interface IUserService {
    User createUser(User user) throws Exception;

    boolean authenticateUser(String email, String password) throws Exception;

    List<User> getUsers();

    User getUser(String email);

    void deleteUser(String email);

    User updateUser(User user) throws Exception;

    void changePassword(String email, String newPassword) throws Exception;
}
