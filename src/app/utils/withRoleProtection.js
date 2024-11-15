"use client";
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

const withRoleProtection = (WrappedComponent, allowedRoles) => {
  const ProtectedComponent = (props) => {
    const { token, loading } = useAuth();
    const router = useRouter();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!token) {
      router.push('/auth/login');
      return null; 
    }

    let decodedToken;
    try {
      decodedToken = jwtDecode(token); 
    } catch (error) {
      console.error("Error decoding token", error);
      router.push('/auth/login');
      return null;
    }

    const userRole = decodedToken.userType;
    if (!allowedRoles.includes(userRole)) {
      router.push('/not-authorized');
      return null; 
    }
    return <WrappedComponent {...props} />;
  };

  // Set a display name for debugging purposes
  ProtectedComponent.displayName = `withRoleProtection(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
};

export default withRoleProtection;
