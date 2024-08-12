import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {
        // Delete user from local storage
        localStorage.removeItem('user');

        // logout function on context
        dispatch({type: 'LOGOUT'});
    }

    return {logout}
}




