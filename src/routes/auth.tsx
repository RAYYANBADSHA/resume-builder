import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "~/lib/auth";

const Auth = () => {
    const { user, isAuthenticated, signIn, signOut } = useAuthStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get("next") || "/";
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (isAuthenticated) navigate(next);
    }, [isAuthenticated, next, navigate]);

    const handleSignIn = () => {
        if (username && email) {
            signIn(username, email);
        }
    };

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>
                    <div>
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-4">
                                <p>Logged in as: {user?.username}</p>
                                <button className="auth-button" onClick={signOut}>
                                    <p>Log Out</p>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="px-4 py-2 border rounded"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-4 py-2 border rounded"
                                />
                                <button className="auth-button" onClick={handleSignIn}>
                                    <p>Log In</p>
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Auth;
