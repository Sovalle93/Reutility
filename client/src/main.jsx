import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthProvider';
import './index.css';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                    <Toaster 
                        position="bottom-right"
                        reverseOrder={false}
                        gutter={8}
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#333',
                                color: '#fff',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                fontSize: '14px',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                                style: {
                                    background: '#10b981',
                                    color: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                                style: {
                                    background: '#ef4444',
                                    color: '#fff',
                                },
                            },
                            loading: {
                                duration: Infinity,
                                style: {
                                    background: '#3b82f6',
                                    color: '#fff',
                                },
                            },
                        }}
                    />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);