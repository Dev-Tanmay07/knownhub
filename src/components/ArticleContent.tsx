import { Skeleton } from "@/components/ui/skeleton";
import AdBanner from "./AdBanner";

interface Section {
  heading: string;
  content: string;
}

interface ArticleContentProps {
  title: string;
  summary: string;
  sections: Section[];
  isLoading: boolean;
}

const ArticleContent = ({ title, summary, sections, isLoading }: ArticleContentProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-32 w-full mt-6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  return (
    <article>
      <h1 className="wiki-article-title">{title}</h1>

      <p className="wiki-body-text mb-6">{summary}</p>

      {/* Ad banner after summary */}
      <AdBanner size="large" />

      {sections.map((section, index) => (
        <div key={index}>
          <h2 className="wiki-section-heading">{section.heading}</h2>
          <div className="wiki-body-text whitespace-pre-line">{section.content}</div>

          {/* Insert ad after every 2 sections */}
          {index > 0 && index % 2 === 1 && <div className="my-6"><AdBanner size="medium" /></div>}
        </div>
      ))}
    </article>
  );
};

export default ArticleContent;
