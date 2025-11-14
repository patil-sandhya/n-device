"use client";
import Home from '@/components/Homepage';
import LoginButton from '@/components/loginbutton';
import { Auth0Provider } from '@auth0/auth0-react';
import Link from "next/link";

export default function HomePage() {
  return (
    <Auth0Provider
     domain="dev-fcepv4jphzal67g7.us.auth0.com"
    clientId="sWhhGDOzdBaINnywlcjS2iL8Ur7GhUt1"
    authorizationParams={{
      redirect_uri: 'http://localhost:3000/private',
    }}
    >
    <Home />
    </Auth0Provider>
  );
}
