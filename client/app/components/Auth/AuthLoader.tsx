"use client"
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useEffect } from 'react';

const AuthLoader = () => {
  const { data, isLoading, error, refetch } = useLoadUserQuery({}, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    // Refetch user data on mount to ensure authentication state is current
    refetch();
  }, [refetch]);

  // Log authentication status for debugging
  useEffect(() => {
    if (data?.user) {
      console.log("User authenticated:", data.user.name, "Role:", data.user.role);
    } else if (error) {
      console.log("User not authenticated");
    }
  }, [data, error]);

  return null; // This component doesn't render anything
};

export default AuthLoader;
