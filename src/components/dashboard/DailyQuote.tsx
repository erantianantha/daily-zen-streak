
import React from "react";
import { useQuote } from "@/context/QuoteContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const DailyQuote: React.FC = () => {
  const { quote, isLoading, fetchNewQuote } = useQuote();

  return (
    <Card className="quote-card overflow-hidden animate-float">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">Daily Mindfulness Quote</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchNewQuote}
              disabled={isLoading}
              className="h-8 w-8 rounded-full"
              aria-label="Refresh quote"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="py-4">
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <blockquote className="text-xl italic font-medium text-foreground relative">
                  <span className="text-4xl text-primary absolute -left-3 -top-3 opacity-20">"</span>
                  {quote.text}
                  <span className="text-4xl text-primary absolute -bottom-6 right-0 opacity-20">"</span>
                </blockquote>
                <footer className="mt-5 text-right text-sm text-muted-foreground">
                  — {quote.author}
                </footer>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
