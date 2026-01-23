// https://reactrouter.com/api/hooks/useNavigate#return-type-augmentation

import 'react-router'

declare module 'react-router' {
    interface NavigateFunction {
        (to: To, options?: NavigateOptions): Promise<void>
        (delta: number): Promise<void>
    }
}
