import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../../../Auth/Interfaces/UserInterface";

// Define la interfaz para la paginación
interface Paginator {
    number: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}


// Define la interfaz para un usuario y el estado inicial
export const initialUserForm: UserInterface = {
    id: "",
    username: '',
    password: '',
    email: '',
    admin: false,
    trainer: false,
    role: "",
    roles: []
};

const initialErrors = {
    username: '',
    password: '',
    email: '',
};
export { initialErrors };

const initialState = {
    users: [] as UserInterface[],
    paginator: { number: 0, totalPages: 1, first: true, last: false } as Paginator,
    userSelected: initialUserForm,
    visibleForm: false,
    errors: initialErrors,
    isLoading: true,
};


// Crear el slice de usuarios
export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<UserInterface>) => {
            state.users = [
                ...state.users,
                {
                    ...action.payload,
                }
            ];
            state.userSelected = initialUserForm;
            state.visibleForm = false;
        },
        removeUser: (state, action: PayloadAction<string>) => { 
            state.users = state.users.filter(user => user.id !== action.payload);
        },
        updateUser: (state, action: PayloadAction<UserInterface>) => {
            state.users = state.users.map(u => {
                if (u.id === action.payload.id) {
                    return {
                        ...action.payload,
                    };
                }
                return u;
            });
            state.userSelected = initialUserForm;
            state.visibleForm = false;
        },
        loadingUsers: (state, action: PayloadAction<UserInterface[]>) => {
            state.users = action.payload;
            state.isLoading = false;
          },
          updatePaginator: (state, action: PayloadAction<Paginator>) => {
            state.paginator = action.payload;
          },
        
        onUserSelectedForm: (state, action: PayloadAction<UserInterface>) => {
            state.userSelected = action.payload;
            state.visibleForm = true;
        },
        onOpenForm: (state) => {
            state.visibleForm = true;
        },
        onCloseForm: (state) => {
            state.visibleForm = false;
            state.userSelected = initialUserForm;
        },
        loadingError: (state, action: PayloadAction<Partial<typeof initialErrors>>) => {
            state.errors = { ...state.errors, ...action.payload };
        }
    }
});

export const {
    addUser,
    removeUser,
    updateUser,
    loadingUsers,
    onUserSelectedForm,
    onOpenForm,
    onCloseForm,
    loadingError,
    updatePaginator,
} = usersSlice.actions;

export default usersSlice.reducer;
