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
            } catch (jwtError) {

              user = {
                id: credentials.email,
                email: credentials.email,
                role: 'USER',
                username: credentials.email.split('@')[0]
              };
            }
          } else if (response.data.id && response.data.email) {
            user = response.data;
            token = response.data.token || "dummy-token";
            refresh = response.data.refreshToken || null;
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

          return userObject;

        } catch (error) {
          
          if (axios.isAxiosError(error)) {
            
            if (error.code === 'ECONNREFUSED') {
              throw new Error("Cannot connect to authentication server");
            }
            
            if (error.response?.status === 401) {
              throw new Error("Invalid email or password");
            }
            
            if (error.response?.status >= 500) {
              throw new Error("Authentication server error");
            }

            throw new Error(`API Error: ${error.response?.status} ${error.response?.statusText}`);
          }
          
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
    
      if (user) {
        console.log("📝 Adding user data to JWT token");
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.token;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          token: token.accessToken,
          refreshToken: token.refreshToken,
        };
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/users",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, 
};

export default function auth(req, res) {

  return NextAuth(req, res, authOptions);
}