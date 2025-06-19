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
        
        if (!credentials?.email || !credentials?.password) {
      
          throw new Error("Missing email or password");
        }

        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`;
          
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

          if (!response.data) {
            console.log("❌ No response data");
            throw new Error("No response data from API");
          }

       
          let user, token, refresh;
          
          if (response.data.access && response.data.user) {
            user = response.data.user;
            token = response.data.access;
            refresh = response.data.refresh;

          } else if (response.data.token && response.data.user) {
            user = response.data.user;
            token = response.data.token;
            refresh = response.data.refreshToken || null;
            console.log("✅ Using structure: { token, user }");
          } else if (response.data.message && response.data.token) {
          
            console.log("✅ Using structure: { message, token }");
            token = response.data.token;
            refresh = null;
            
            try {
              const tokenPayload = JSON.parse(atob(token.split('.')[1]));
              console.log("🔍 JWT Payload:", tokenPayload);
              
              user = {
                id: tokenPayload.sub || credentials.email, 
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
            throw new Error("Invalid response structure from API");
          }

          if (!user) {
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
          
          if (axios.isAxiosError(error)) {
            
            if (error.code === 'ECONNREFUSED') {
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