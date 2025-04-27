import { ArchitectureEditorClient } from "./_components/architecture-editor-client";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const layoutCookie = cookieStore.get("recall:architecture-editor-layout");
  const defaultLayout = layoutCookie
    ? JSON.parse(layoutCookie.value ?? "[25, 75]")
    : [25, 75];

  // You could also fetch initial YAML here from the server if needed
  let initialYaml = "";

  // Using server actions or a proper API route would be better for server-side fetching
  // In this implementation, we'll let the client component handle the initial YAML fetch

  return (
    <ArchitectureEditorClient
      defaultLayout={defaultLayout}
      initialYaml={initialYaml}
    />
  );
}
