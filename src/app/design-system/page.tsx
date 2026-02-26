import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { theme } from "@/components/theme/theme";

const lightTokens = Object.entries(theme.light);
const darkTokens = Object.entries(theme.dark);

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Design System
          </p>
          <h1 className="text-3xl font-bold tracking-tight">ReadOS UI Kit</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Theme tokens and shared UI components based on the JSON palette. Toggle dark
            mode to review the full system.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card text-card-foreground">
            <CardHeader>
              <CardTitle>Light Theme Tokens</CardTitle>
              <CardDescription>Palette for light surfaces and text.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {lightTokens.map(([name, value]) => (
                  <div key={name} className="rounded-lg border border-border p-3">
                    <div
                      className="mb-2 h-8 w-full rounded-md"
                      style={{ backgroundColor: value }}
                    />
                    <p className="text-xs font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="dark">
            <Card className="h-full bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>Dark Theme Tokens</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Palette for dark surfaces and text.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {darkTokens.map(([name, value]) => (
                    <div key={name} className="rounded-lg border border-border p-3">
                      <div
                        className="mb-2 h-8 w-full rounded-md"
                        style={{ backgroundColor: value }}
                      />
                      <p className="text-xs font-semibold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Buttons & Chips</CardTitle>
              <CardDescription>Primary, secondary, and outline actions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Chip>Motivated</Chip>
              <Chip active>Productive</Chip>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges & Avatars</CardTitle>
              <CardDescription>Status indicators and quick labels.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Badge>Neutral</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Avatar fallback="RD" />
              <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf7ihLUc1x-bg5PYR36BUKYOLiqSKnovre6rwSEHiVluH4avifnAMEfIok4tvYdzYn4MCwRnf276-bI5MHIUdhdTHQAM64q_Q2M72ontuFnFJ5oJpgM2CBDbUHbUN_MM3xGzrbr0Vjmv2oxkiZI3e5tptdmZMDTCIxZoEboHmfsb4_58rTvnJu6iC37Po_cwmy41cbErr6edxWNG__xerpebT_aNr5z4ayclWmRobWiWxjBvCOwSRz52Q4pystJ_aPIMSG2-wkJkA" />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Fields with light and dark support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Search books, authors..." />
              <Input placeholder="Email address" type="email" />
              <Textarea placeholder="Write your note..." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card Example</CardTitle>
              <CardDescription>Content layout using shared components.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
                This surface shows the muted background token.
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border p-4">
                <div>
                  <p className="text-sm font-semibold">Reading Consultant</p>
                  <p className="text-xs text-muted-foreground">
                    AI Assistant • Online
                  </p>
                </div>
                <Button size="sm">Message</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
