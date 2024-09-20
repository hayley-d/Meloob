class UserManager {
    constructor() {
        this.users = [
            {username:'hayley',email:'hayleydod@proton.me',password:'admin'}
        ]; // Array to store user objects
    }

    // Method to add a new user
    addUser(user) {
        const existingUser = this.users.find(u => u.email === user.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        this.users.push(user);
    }

    // Method to get a user by email
    getUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    // Method to get all users
    getAllUsers() {
        return this.users;
    }
}

// Export an instance of UserManager
const userManager = new UserManager();
export default userManager;
