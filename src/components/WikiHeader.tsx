import { Search, Globe, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WikiHeader = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/article/${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="wiki-container flex items-center justify-between py-3 gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 shrink-0"
        >
          <Globe className="h-7 w-7 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground hidden sm:inline">
            KnowHub
          </span>
        </button>

        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for any topic..."
              className="w-full rounded-full border border-input bg-background px-10 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </form>

        <button
          onClick={() => navigate("/random")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden md:inline">Random</span>
        </button>
      </div>
    </header>
  );
};

export default WikiHeader;
