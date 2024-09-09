import React from 'react';
import 'react-times/css/material/default.css';
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from 'store';
import { BrowserRouter } from 'react-router-dom';
import { DEFAULT_QUERY_OPTION } from 'utils/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RoutesLayout from 'routes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import Location from 'components/common/Location';
import ScrollToTop from 'components/common/ScrollToTop';
import PopUpConfirmLogin from 'components/common/Modal/PopUpConfirmLogin';
import { ColorSystem } from 'components/common/ColorSystem';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: DEFAULT_QUERY_OPTION,
    },
});
const App = () => <RoutesLayout />;

const AppWrapper: React.FC = () => (
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ToastContainer />
                    <App />
                    <PopUpConfirmLogin />
                    <Location />
                    <ScrollToTop />
                    <ColorSystem />
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    </BrowserRouter>
);
export default AppWrapper;
