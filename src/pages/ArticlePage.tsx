import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import WikiHeader from "@/components/WikiHeader";
import ArticleContent from "@/components/ArticleContent";
import AdBanner from "@/components/AdBanner";

interface Section {
  heading: string;
  content: string;
}

interface ArticleData {
  title: string;
  summary: string;
  sections: Section[];
}

const ArticlePage = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!topic) return;
    const decodedTopic = decodeURIComponent(topic);
    fetchArticle(decodedTopic);
  }, [topic]);

  const fetchArticle = async (searchTopic: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-article", {
        body: { topic: searchTopic },
      });

      if (error) throw error;

      if (data?.error) {
        if (data.error.includes("Rate limit")) {
          toast.error("Too many requests. Please wait a moment and try again.");
        } else if (data.error.includes("Payment required")) {
          toast.error("Service temporarily unavailable. Please try again later.");
        } else {
          toast.error(data.error);
        }
        setArticle({ title: searchTopic, summary: "Unable to load article content. Please try again.", sections: [] });
        return;
      }

      setArticle(data);
    } catch (err) {
      console.error("Failed to fetch article:", err);
      toast.error("Failed to generate article. Please try again.");
      setArticle({ title: searchTopic, summary: "An error occurred while generating this article.", sections: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WikiHeader />
      <div className="wiki-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <ArticleContent
            title={article?.title || decodeURIComponent(topic || "")}
            summary={article?.summary || ""}
            sections={article?.sections || []}
            isLoading={isLoading}
          />
          <aside className="space-y-6 hidden lg:block">
            <AdBanner size="large" />
            <div className="border border-border rounded-lg p-4 bg-card">
              <h3 className="font-heading font-bold text-sm mb-3">Related Topics</h3>
              <div className="space-y-2">
                {["Science", "History", "Technology", "Philosophy", "Mathematics"].map((t) => (
                  <button
                    key={t}
                    onClick={() => navigate(`/article/${encodeURIComponent(t)}`)}
                    className="block text-sm wiki-link font-body"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <AdBanner size="small" />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
