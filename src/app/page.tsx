import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getVinyls } from "./actions";

export default async function Home() {
  const vinyls = await getVinyls();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-light mb-4">My Vinyl Collection</h1>
      <Link href="/add">
        <Button className="mb-4">Add New Vinyl</Button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vinyls.map((vinyl) => (
          <Card key={vinyl.id}>
            <CardHeader>
              <CardTitle className="font-light">{vinyl.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{vinyl.artist}</p>
              <p className="text-sm text-muted-foreground">{vinyl.year}</p>
              <Link href={`/vinyl/${vinyl.id}`}>
                <Button variant="outline" className="mt-2">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
