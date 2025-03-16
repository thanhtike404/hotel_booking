'use client';

import { SessionProvider } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';

const AuthProvider = ({ children }: any) => {
    return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;