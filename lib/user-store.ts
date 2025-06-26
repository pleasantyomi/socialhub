// Shared in-memory user store for demo purposes
// In production, this would be a proper database

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  image?: string;
  created_at: string;
}

// In-memory user storage
let users: User[] = [];

export const userStore = {
  // Get all users
  getUsers: () => users,
  
  // Find user by email
  findByEmail: (email: string) => users.find(user => user.email === email),
  
  // Find user by ID
  findById: (id: string) => users.find(user => user.id === id),
  
  // Add new user
  addUser: (user: User) => {
    users.push(user);
    return user;
  },
  
  // Check if user exists
  exists: (email: string) => users.some(user => user.email === email),
  
  // Get user count
  count: () => users.length,
  
  // Clear all users (for testing)
  clear: () => {
    users = [];
  }
};
