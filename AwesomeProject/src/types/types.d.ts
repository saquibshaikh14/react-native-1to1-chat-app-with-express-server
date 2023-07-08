interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
}

interface User {
  username: string;
  name: string;
  shortName: string;
  availableList: string[];
  // Add other user-related properties as needed
}

interface AppError {
  errorCode: number | string;
  errorPage: string;
  errorType: string; //login_error, access_denied
  errorMessage: string;
}

interface ApiResponse<T = any> {
    error: ApiError | null;
    data:T | null;
    ok: Boolean;
  }
  
interface Message {
  receiver: string;
  sender: string;
  message: string;
}
