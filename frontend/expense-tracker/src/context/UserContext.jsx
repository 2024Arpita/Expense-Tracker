import React,{createContext,useState} from 'react';

// 💡 Helper function to check localStorage for the token
const getInitialUser = () => {
    try {
        // Check for the token saved during login
        const token = localStorage.getItem('authtoken'); 
        
        if (token) {
            // Return a placeholder object. This stops the immediate 'user === null' 
            // check from redirecting before the API confirms the full user data.
            return { isAuthenticated: true }; 
        }
        return null;
    } catch (e) {
        return null;
    }
};

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

const UserProvider = ({ children }) => {
    // 🛑 CRITICAL FIX 1: Initialize state using the token check
    const [user, setUser] = useState(getInitialUser()); 
        
    //function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    }

    //function to clear user data (e.g. on logout)
    const clearUser = () => {
        // 🛑 CRITICAL FIX 2: Remove the token from localStorage on logout
        localStorage.removeItem('authtoken'); 
        setUser(null);
    }

    return (
        <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
        }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;