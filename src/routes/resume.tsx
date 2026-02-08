import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppStore } from "~/lib/store";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

const Resume = () => {
    const { kvGet, readFile } = useAppStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add this to see if component renders at all
    console.log("Resume component rendered, ID:", id);

    useEffect(() => {
        const loadResume = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log("=== Loading resume ===");
                console.log("Resume ID:", id);
                
                const resumeData = await kvGet(`resume:${id}`);
                console.log("Raw resume data from storage:", resumeData);

                if (!resumeData) {
                    console.error("No resume data found for ID:", id);
                    setError("Resume not found. It may not have been saved correctly.");
                    setLoading(false);
                    return;
                }

                console.log("Parsing resume data...");
                const data = JSON.parse(resumeData);
                console.log("Parsed data:", data);

                if (!data.feedback) {
                    console.warn("No feedback in resume data");
                    setError("Resume analysis not complete");
                    setLoading(false);
                    return;
                }

                console.log("Loading resume file from:", data.resumePath);
                const resumeBlob = await readFile(data.resumePath);
                if (resumeBlob) {
                    const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
                    const url = URL.createObjectURL(pdfBlob);
                    setResumeUrl(url);
                    console.log("Resume PDF loaded successfully");
                } else {
                    console.warn("Failed to load resume PDF");
                }

                console.log("Loading image from:", data.imagePath);
                const imageBlob = await readFile(data.imagePath);
                if (imageBlob) {
                    const url = URL.createObjectURL(imageBlob);
                    setImageUrl(url);
                    console.log("Resume image loaded successfully");
                } else {
                    console.warn("Failed to load resume image");
                }

                console.log("Setting feedback:", data.feedback);
                setFeedback(data.feedback);
                setLoading(false);
                console.log("=== Resume loaded successfully ===");
            } catch (err) {
                console.error("=== Error loading resume ===");
                console.error("Error details:", err);
                console.error("Error stack:", err instanceof Error ? err.stack : "No stack trace");
                setError(err instanceof Error ? err.message : "Failed to load resume");
                setLoading(false);
            }
        };

        if (id) {
            console.log("Starting to load resume with ID:", id);
            loadResume();
        } else {
            console.error("No resume ID provided");
            setError("No resume ID provided");
        }
    }, [id, kvGet, readFile]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <nav className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <img src="/icons/back.svg" alt="back" className="w-4 h-4" />
                        <span>Back to Homepage</span>
                    </Link>
                </nav>
                <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <img src="/images/resume-scan-2.gif" className="w-64 mx-auto mb-4" alt="Loading" />
                    <p className="text-xl text-gray-700">Loading your resume analysis...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Always visible test div */}
            <div className="bg-red-500 text-white p-4 text-center font-bold">
                RESUME PAGE LOADED - ID: {id} - Loading: {loading ? "YES" : "NO"}
            </div>

            <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
                <div className="container mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <img src="/icons/back.svg" alt="back" className="w-4 h-4" />
                        <span className="font-semibold">Back to Homepage</span>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Resume Preview */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Resume Preview</h3>
                        {imageUrl && resumeUrl ? (
                            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="block">
                                <img
                                    src={imageUrl}
                                    className="w-full border rounded-lg hover:shadow-xl transition-shadow"
                                    alt="Resume preview"
                                />
                            </a>
                        ) : (
                            <div className="bg-gray-100 p-8 rounded-lg text-center">
                                <p className="text-gray-600">No preview available</p>
                            </div>
                        )}
                    </div>

                    {/* Feedback */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Resume Review</h2>
                        
                        {feedback ? (
                            <div className="space-y-6">
                                <Summary feedback={feedback} />
                                <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                <Details feedback={feedback} />
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow text-center">
                                <p className="text-gray-600">No feedback available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Resume;
