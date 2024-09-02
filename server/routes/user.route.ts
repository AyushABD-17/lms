
import express from 'express';
import { activateUser, deleteUser, getAllUsers, getUserInfo, loginUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updateAvatar, updatePassword, updateUserInfo, updateUserRole } from '../controllers/user.controllers';
import { authorizeRoles, isAuthenticate } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login', loginUser);

userRouter.get('/logout', isAuthenticate, logoutUser);

userRouter.get("/refresh", updateAccessToken);

userRouter.get("/me", isAuthenticate,getUserInfo);

userRouter.post("/social-auth",socialAuth);

userRouter.put("/update-user-info", isAuthenticate, updateUserInfo);

userRouter.put("/update-user-password", isAuthenticate, updatePassword);

userRouter.put("/update-user-avatar", isAuthenticate, updateAvatar);
userRouter.get("/get-all-users", isAuthenticate,authorizeRoles('admin') ,getAllUsers);
userRouter.put("/update-user", isAuthenticate,authorizeRoles('admin') ,updateUserRole);
userRouter.put("/delete-user", isAuthenticate,authorizeRoles('admin') ,deleteUser);







export default userRouter;

