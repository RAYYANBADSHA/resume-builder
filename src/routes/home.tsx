import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { useAuthStore } from "~/lib/auth";
import { useAppStore } from "~/lib/store";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { kvList } = useAppStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth?next=/");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumeItems = await kvList("resume:*", true);

      const parsedResumes = resumeItems?.map((item: any) =>
        JSON.parse(item.value) as Resume
      );

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    if (isAuthenticated) {
      loadResumes();
    }
  }, [isAuthenticated, kvList]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Loading" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
