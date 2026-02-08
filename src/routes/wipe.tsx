import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "~/lib/auth";
import { useAppStore } from "~/lib/store";

const WipeApp = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { listFiles, clearAll, isLoading, error } = useAppStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<Array<{ id: string; path: string; name: string }>>([]);

    const loadFiles = async () => {
        const filesList = await listFiles();
        setFiles(filesList);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, isAuthenticated, navigate]);

    const handleDelete = async () => {
        await clearAll();
        loadFiles();
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            Authenticated as: {user?.username}
            <div>Existing files:</div>
            <div className="flex flex-col gap-4">
                {files.map((file) => (
                    <div key={file.id} className="flex flex-row gap-4">
                        <p>{file.name}</p>
                    </div>
                ))}
            </div>
            <div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
                    onClick={() => handleDelete()}
                >
                    Wipe App Data
                </button>
            </div>
        </div>
    );
};

export default WipeApp;
