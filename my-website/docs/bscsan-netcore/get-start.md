---
sidebar_position: 1

---

# Get Started

:::info Requirements

You have a knowledge in `.NET Core/ASP.NET Core` , you can read [ASP.NET Core fundamentals | Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/?view=aspnetcore-6.0&tabs=windows)

:::

## Add New **WebApp Project**

![New Web App](/img/tutorial/bscscan/new-web-project.png)

## Configure the **WebApp Project**

![New Web App](/img/tutorial/bscscan/new-web-project-1.png)

## Add the Nuget package to the **WebApp Project**

![New Web App](/img/tutorial/bscscan/new-web-project-2.png)

Download and Install the latest `BscScan.NetCore` from [NuGet](https://www.nuget.org/packages/BscScan.NetCore/) using Package Manager, CLI or by adding it to Package Reference:

```powershell
PM> Install-Package BscScan.NetCore -Version 1.0.1
```

```shell
> dotnet add package BscScan.NetCore --version 1.0.1
```

```svg
<PackageReference Include="BscScan.NetCore" Version="1.0.1" />
```

Add **Markdown or React** files to `src/pages` to create a **standalone page**:

- `src/pages/index.js` -> `localhost:3000/`
- `src/pages/foo.md` -> `localhost:3000/foo`
- `src/pages/foo/bar.js` -> `localhost:3000/foo/bar`

## Create your first React Page

Create a file at `src/pages/my-react-page.js`:

```jsx
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}
```

A new page is now available at `http://localhost:3000/my-react-page`.

## Create your first Markdown Page

Create a file at `src/pages/my-markdown-page.md`:

```mdx
# My Markdown page

This is a Markdown page
```

A new page is now available at `http://localhost:3000/my-markdown-page`.
