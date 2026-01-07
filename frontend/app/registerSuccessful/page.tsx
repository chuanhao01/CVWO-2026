import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="gap-3">
        <CardHeader>
          <CardTitle>Account registration successful</CardTitle>
        </CardHeader>
        <CardContent>
          Please verify you account with the link sent to you email.
        </CardContent>
      </Card>
    </div>
  );
}
