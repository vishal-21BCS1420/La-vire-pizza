import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

export const API_END_POINT = "https://la-vire-pizza.onrender.com/api/v1/user"
axios.defaults.withCredentials = true;

type User = {
    fullname:string;
    email:string;
    contact:number;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    admin:boolean;
    isVerified:boolean;
}

type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loading: boolean;
    signup: (input:SignupInputState) => Promise<void>;
    login: (input:LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email:string) => Promise<void>; 
    resetPassword: (token:string, newPassword:string) => Promise<void>; 
    updateProfile: (input:any) => Promise<void>; 
}

export const useUserStore = create<UserState>()(persist((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    // signup api implementation
    // signup: async (input: SignupInputState) => {
    //     try {
    //         set({ loading: true });
    //         const response = await axios.post(`${API_END_POINT}/signup`, input, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response.data.success) { 
    //             toast.success(response.data.message);
    //             set({ loading: false, user: response.data.user, isAuthenticated: true });
    //         }
    //     } catch (error: any) {
    //         toast.error(error.response.data.message);
    //         set({ loading: false });
    //     }
    // },
    signup: async (input: SignupInputState) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/signup`, input, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.data.success) {
                toast.success(response.data.message);
                set({ user: response.data.user, isAuthenticated: true });
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error occurred during signup");
        } finally {
            set({ loading: false }); // Always reset loading to false
        }
    },
    
    // login: async (input: LoginInputState) => {
    //     try {
    //         set({ loading: true });
    //         const response = await axios.post(`${API_END_POINT}/login`, input, {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         if (response.data.success) { 
    //             toast.success(response.data.message);
    //             set({ loading: false, user: response.data.user, isAuthenticated: true });
    //         } else {
    //             toast.error(response.data.message || "Something went wrong");
    //         }
    //     } catch (error: any) {
    //         toast.error(error.response.data.message);
    //         set({ loading: false });
    //     } finally {
    //         set({ loading: false }); // Always reset loading to false
    //     }
    // },
    login: async (input: LoginInputState) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.data.success) {
            // Set user and authenticated state
            set({ user: response.data.user, isAuthenticated: true });
          } else {
            // If the response doesn't indicate success, show an error
            toast.error(response.data.message || "Invalid credentials");
          }
        } catch (error: any) {
          // Handle error from the server
          toast.error(
            error.response?.data?.message || "An error occurred while logging in"
          );
        } finally {
          // Always reset loading, regardless of the outcome
          set({ loading: false });
        }
      },      
    verifyEmail: async (verificationCode: string) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
            }
        } catch (error: any) {
            toast.success(error.response.data.message);
            set({ loading: false });
        }
    },
    checkAuthentication: async () => {
        try {
            set({ isCheckingAuth: true });
            const response = await axios.get(`${API_END_POINT}/check-auth`);
            if (response.data.success) {
                set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            }
        } catch (error) {
            set({isAuthenticated: false, isCheckingAuth: false });
        }
    },
    logout: async () => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/logout`);
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false, user: null, isAuthenticated: false })
            }
        } catch (error:any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    forgotPassword: async (email: string) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    resetPassword: async (token: string, newPassword: string) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    updateProfile: async (input:any) => {
        try { 
            const response = await axios.put(`${API_END_POINT}/profile/update`, input,{
                headers:{
                    'Content-Type':'application/json'
                }
            });
            if(response.data.success){
                toast.success(response.data.message);
                set({user:response.data.user, isAuthenticated:true});
            }
        } catch (error:any) { 
            toast.error(error.response.data.message);
        }
    }
}),
    {
        name: 'user-name',
        storage: createJSONStorage(() => localStorage),
    }
))
// import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";
// import axios, { AxiosError } from "axios";
// import { toast } from "sonner";
// import { LoginInputState, SignupInputState } from "@/schema/userSchema";

// const API_END_POINT = "http://localhost:3000/api/v1/user";
// axios.defaults.withCredentials = true;

// type User = {
//     fullname: string;
//     email: string;
//     contact: number;
//     address: string;
//     city: string;
//     country: string;
//     profilePicture: string;
//     admin: boolean;
//     isVerified: boolean;
// }

// type UpdateProfileInput = {
//     fullname?: string;
//     contact?: string;
//     address?: string;
//     city?: string;
//     country?: string;
//     profilePicture?: string;
// }

// type UserState = {
//     user: User | null;
//     isAuthenticated: boolean;
//     isCheckingAuth: boolean;
//     loading: boolean;
//     error: string | null;
//     signup: (input: SignupInputState) => Promise<void>;
//     login: (input: LoginInputState) => Promise<void>;
//     verifyEmail: (verificationCode: string) => Promise<void>;
//     checkAuthentication: () => Promise<void>;
//     logout: () => Promise<void>;
//     forgotPassword: (email: string) => Promise<void>; 
//     resetPassword: (token: string, newPassword: string) => Promise<void>; 
//     updateProfile: (input: UpdateProfileInput) => Promise<void>;
//     resetError: () => void;
// }

// export const useUserStore = create<UserState>()(persist((set) => ({
//     user: null,
//     isAuthenticated: false,
//     isCheckingAuth: true,
//     loading: false,
//     error: null,

//     // Generic error handler
//     handleError: (error: AxiosError) => {
//         const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
//         toast.error(errorMessage);
//         set({ loading: false, error: errorMessage });
//     },

//     // Signup method
//     signup: async (input: SignupInputState) => {
//         try {
//             set({ loading: true, error: null });
//             const response = await axios.post(`${API_END_POINT}/signup`, input, {
//                 headers: { 'Content-Type': 'application/json' }
//             });

//             if (response.data.success) { 
//                 toast.success(response.data.message);
//                 set({ 
//                     loading: false, 
//                     user: response.data.user, 
//                     isAuthenticated: true,
//                     error: null 
//                 });
//             }
//         } catch (error: any) {
//             if (axios.isAxiosError(error)) {
//                 set((state) => state.handleError(error));
//             } else {
//                 toast.error('Signup failed. Please try again.');
//                 set({ loading: false, error: 'Signup failed' });
//             }
//         }
//     },

//     // Login method
//     login: async (input: LoginInputState) => {
//         try {
//             set({ loading: true, error: null });
//             const response = await axios.post(`${API_END_POINT}/login`, input, {
//                 headers: { 'Content-Type': 'application/json' }
//             });

//             if (response.data.success) { 
//                 toast.success(response.data.message);
//                 set({ 
//                     loading: false, 
//                     user: response.data.user, 
//                     isAuthenticated: true,
//                     error: null 
//                 });
//             }
//         } catch (error: any) {
//             if (axios.isAxiosError(error)) {
//                 set((state) => state.handleError(error));
//             } else {
//                 toast.error('Login failed. Please try again.');
//                 set({ loading: false, error: 'Login failed' });
//             }
//         }
//     },

//     // Email Verification method
//     verifyEmail: async (verificationCode: string) => {
//         try {
//             set({ loading: true, error: null });
//             const response = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
//                 headers: { 'Content-Type': 'application/json' }
//             });

//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 set({ 
//                     loading: false, 
//                     user: response.data.user, 
//                     isAuthenticated: true,
//                     error: null 
//                 });
//             }
//         } catch (error: any) {
//             if (axios.isAxiosError(error)) {
//                 set((state) => state.handleError(error));
//             } else {
//                 toast.error('Email verification failed.');
//                 set({ loading: false, error: 'Verification failed' });
//             }
//         }
//     },

//     // Authentication Check method
//     checkAuthentication: async () => {
//         try {
//             set({ isCheckingAuth: true });
//             const response = await axios.get(`${API_END_POINT}/check-auth`);
            
//             if (response.data.success) {
//                 set({
//                     user: response.data.user, 
//                     isAuthenticated: true, 
//                     isCheckingAuth: false 
//                 });
//             } else {
//                 set({
//                     isAuthenticated: false, 
//                     isCheckingAuth: false,
//                     user: null
//                 });
//             }
//         } catch (error) {
//             set({
//                 isAuthenticated: false, 
//                 isCheckingAuth: false,
//                 user: null
//             });
//         }
//     },

//     // Logout method
//     logout: async () => {
//         try {
//             set({ loading: true });
//             const response = await axios.post(`${API_END_POINT}/logout`);
            
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 set({ 
//                     loading: false, 
//                     user: null, 
//                     isAuthenticated: false 
//                 });
//             }
//         } catch (error: any) {
//             if (axios.isAxiosError(error)) {
//                 set((state) => state.handleError(error));
//             } else {
//                 toast.error('Logout failed.');
//                 set({ loading: false });
//             }
//         }
//     },

//     // Forgot Password method
//     forgotPassword: async (email: string) => {
//         try {
//             set({ loading: true, error: null });
//             const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
            
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 set({ loading: false });
//             }
//         } catch (error: any) {
//             if (axios.isAxiosError(error)) {
//                 set((state) => state.handleError(error));
//             } else {
//                 toast.error('Password reset request failed.');
//                 set({ loading: false, error: 'Reset failed' });
//             }
//         }
//     },

//     // Reset Password method
//     resetPassword: async (token: string, newPassword: string) => {
//         try {
//             set({ loading: true, error: null });
//             const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
            
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 set({ loading: false });
//             }
//         } catch (error: any) {
//             if (axios.isAxiosError(error)) {
//                 set((state) => state.handleError(error));
//             } else {
//                 toast.error('Password reset failed.');
//                 set({ loading: false, error: 'Reset failed' });
//             }
//         }
//     },

//     // Update Profile method
//     updateProfile: async (input: UpdateProfileInput) => {
//         try {
//             set({ loading: true, error: null });
//             const response = await axios.put(`${API_END_POINT}/profile/update`, input, {
//                 headers: { 'Content-Type': 'application/json' }
//             });
            
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 set({ 
//                     user: response.data.user, 
//                     isAuthenticated: true,
//                     loading: false 
//                 });
//             }
//         } catch (error: any) {
//             if (axios.isAxiosError(error)) {
//                 set((state) => state.handleError(error));
//             } else {
//                 toast.error('Profile update failed.');
//                 set({ loading: false, error: 'Update failed' });
//             }
//         }
//     },

//     // Reset Error method
//     resetError: () => set({ error: null })
// }), {
//     name: 'user-store',
//     storage: createJSONStorage(() => localStorage),
// }));