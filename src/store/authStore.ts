import axios from 'axios';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
    token: string | null,
    userId: number | null,
    username: string,
    spaces: Array<any>,
    bgColor: string,
    cardColor: string,
    setBgColor: ( bgColor: string) => void,
    setCardColor: (cardColor: string) => void,
    setToken: (token: string, userId: number) => void,
    setUsername: (username: string) => void,
    logout: () => void,
    isAuth: boolean,
    fetchSpaces: () => Promise<void>,
}

export const useAuthStore = create(persist<State>(
    (set, get) => ({
        token: null,
        userId: null,
        username: "",
        isAuth: false,
        spaces: [],
        bgColor: "",
        cardColor: "",
        setBgColor: (bgColor: string) => set((state) =>({
            bgColor
        })),
        setCardColor: (cardColor: string) => set((state) =>({
            cardColor
        })),
        setToken: (token: string, userId: number) => set((state) => ({
            token,
            userId,
            isAuth: true
        })),
        setUsername: (username: string) => set((state) => ({
            username
        })),
        logout: () => set(state => ({
            token: "",
            userId: null,
            isAuth: false,
        })),
        fetchSpaces: async () => {
            const token = get().token;
            if (token) {
                try {
                    const response = await axios.get("http://localhost:5000/api/spaces", { headers: { "token": token } });
                    set({ spaces: response.data.data }); // Adjust according to your API response structure
                } catch (error) {
                    console.error("Error fetching spaces:", error);
                }
            }
        },
    }), {
    name: "auth"
}));
