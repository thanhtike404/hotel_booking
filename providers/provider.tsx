'use client';


import React, { PropsWithChildren } from 'react';
import AuthProvider from '@/components/providers/session-provider';
const Provider = ({ children }: any) => {
    return <AuthProvider>{children}</AuthProvider>;
};

export default Provider;