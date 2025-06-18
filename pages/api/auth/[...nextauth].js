import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔄 AUTHORIZE FUNCTION CALLED");
        console.log("📧 Email:", credentials?.email);
        console.log("🔒 Password length:", credentials?.password?.length);
        console.log("🌍 API URL:", process.env.NEXT_PUBLIC_API_URL);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          throw new Error("Missing email or password");
        }

        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`;
          console.log("📡 Making request to:", apiUrl);
          
          const requestData = {
            email: credentials.email,
            password: credentials.password,
          };
          console.log("📤 Request data:", requestData);
          
          const response = await axios.post(apiUrl, requestData, {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
            }
          });

          console.log("✅ API Response status:", response.status);
          console.log("📄 API Response data:", JSON.stringify(response.data, null, 2));

          // Check if response has the expected structure
          if (!response.data) {
            console.log("❌ No response data");
            throw new Error("No response data from API");
          }

          // Handle different response structures
          let user, token, refresh;
          
          if (response.data.access && response.data.user) {
            // Structure: { access, refresh, user }
            user = response.data.user;
            token = response.data.access;
            refresh = response.data.refresh;
            console.log("✅ Using structure: { access, refresh, user }");
          } else if (response.data.token && response.data.user) {
            // Structure: { token, user }
            user = response.data.user;
            token = response.data.token;
            refresh = response.data.refreshToken || null;
            console.log("✅ Using structure: { token, user }");
          } else if (response.data.message && response.data.token) {
            // Structure: { message, token } - YOUR API STRUCTURE
            // Since there's no user object, we'll extract user info from the JWT token
            console.log("✅ Using structure: { message, token }");
            token = response.data.token;
            refresh = null;
            
            // Extract user info from JWT token payload
            try {
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              console.log("🔍 JWT Payload:", tokenPayload);
              
              user = {
                id: tokenPayload.sub || credentials.email, // Use email as fallback ID
                email: tokenPayload.sub || credentials.email,
                role: tokenPayload.role || 'USER',
                username: tokenPayload.username || credentials.email.split('@')[0]
              };
              console.log("✅ Extracted user from JWT:", user);
            } catch (jwtError) {
              console.log("⚠️ Could not parse JWT, using basic user info");
              user = {
                id: credentials.email,
                email: credentials.email,
                role: 'USER',
                username: credentials.email.split('@')[0]
              };
            }
          } else if (response.data.id && response.data.email) {
            // Direct user object
            user = response.data;
            token = response.data.token || "dummy-token";
            refresh = response.data.refreshToken || null;
            console.log("✅ Using direct user object structure");
          } else {
            console.log("❌ Unknown response structure:", Object.keys(response.data));
            throw new Error("Invalid response structure from API");
          }

          if (!user) {
            console.log("❌ No user data found in response");
            throw new Error("No user data in API response");
          }

          const userObject = {
            id: user.id?.toString() || "1",
            email: user.email,
            name: user.username || user.name || user.email,
            role: user.role || 'User',
            token: token,
            refreshToken: refresh,
          };

          console.log("✅ Returning user object:", JSON.stringify(userObject, null, 2));
          return userObject;

        } catch (error) {
          console.error("❌ Authorization error:", error);
          
          if (axios.isAxiosError(error)) {
            console.error("🔍 Axios error details:");
            console.error("  - Status:", error.response?.status);
            console.error("  - Status Text:", error.response?.statusText);
            console.error("  - Response Data:", error.response?.data);
            console.error("  - Request URL:", error.config?.url);
            console.error("  - Request Method:", error.config?.method);
            console.error("  - Request Headers:", error.config?.headers);
            console.error("  - Request Data:", error.config?.data);
            
            if (error.code === 'ECONNREFUSED') {
              console.error("🔌 Connection refused - Is your backend server running?");
              throw new Error("Cannot connect to authentication server");
            }
            
            if (error.response?.status === 401) {
              console.error("🚫 Invalid credentials from API");
              throw new Error("Invalid email or password");
            }
            
            if (error.response?.status >= 500) {
              console.error("🔥 Server error from API");
              throw new Error("Authentication server error");
            }

            throw new Error(`API Error: ${error.response?.status} ${error.response?.statusText}`);
          }
          
          console.error("🔥 Non-Axios error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🔑 JWT CALLBACK TRIGGERED");
      console.log("  - Has token:", !!token);
      console.log("  - Has user:", !!user);
      console.log("  - Has account:", !!account);
      
      if (user) {
        console.log("📝 Adding user data to JWT token");
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
        console.log("✅ JWT token updated");
      }
      return token;
    },
    async session({ session, token }) {
      console.log("👤 SESSION CALLBACK TRIGGERED");
      console.log("  - Has session:", !!session);
      console.log("  - Has token:", !!token);
      
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          token: token.accessToken,
          refreshToken: token.refreshToken,
        };
        console.log("✅ Session user created:", session.user.email);
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/users",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Force enable debug
};

// For Pages Router (pages/api/auth/[...nextauth].js)
export default function auth(req, res) {
  console.log("🚀 NextAuth handler called");
  console.log("  - Method:", req.method);
  console.log("  - URL:", req.url);
  console.log("  - Headers:", JSON.stringify(req.headers, null, 2));
  
  return NextAuth(req, res, authOptions);
}