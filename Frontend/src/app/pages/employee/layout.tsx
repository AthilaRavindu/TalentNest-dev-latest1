// Make sure the path is correct; update if necessary
import ReduxProvider from '../../components/ReduxProvider';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Talentnest',
  description: 'Talentnest HR Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReduxProvider>
      {children}
      <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f766e', // teal-700
              color: '#fff',
              fontWeight: '500',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
            },
            success: {
              duration: 3000,
              style: {
                background: '#059669', // emerald-600
                color: '#fff',
              },
              iconTheme: {
                primary: '#10b981', // emerald-500
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              style: {
                background: '#dc2626', // red-600
                color: '#fff',
              },
              iconTheme: {
                primary: '#ef4444', // red-500
                secondary: '#fff',
              },
            },
            loading: {
              style: {
                background: '#0891b2', // cyan-600
                color: '#fff',
              },
            },
          }}
        />
    </ReduxProvider>
  )
}
