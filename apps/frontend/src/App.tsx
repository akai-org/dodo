import './App.scss';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router.tsx';
import Layout from './layout/Layout.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {/* <GoogleOAuthProvider clientId={'XD'}> */}
                <Layout>
                    <RouterProvider router={router} />
                </Layout>
                <ToastContainer />
            {/* </GoogleOAuthProvider> */}
        </QueryClientProvider>
    );
}

export default App;
