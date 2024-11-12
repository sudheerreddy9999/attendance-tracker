import "./globals.css";
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { Navigation } from "@/app/components/nav"; // Import Navigation

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* Wrap the entire body with AuthProvider */}
          <Navigation /> {/* Navigation can now access AuthContext */}
          {children} {/* Children will also have access to AuthContext */}
        </AuthProvider>
      </body>
    </html>
  );
}
