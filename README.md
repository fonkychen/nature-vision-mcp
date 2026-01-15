\# Nature Vision MCP Server



An \*\*MCP (Model Context Protocol) server\*\* that identifies biological species from images using the \*\*Nature Vision API\*\*, returning Latin names with confidence scores.  

This server enables LLMs (such as Claude) to recognize species and enrich responses with biological knowledge.



---



\## Features



\- 🌿 Identify species from images (plants, animals, fungi, insects, etc.)

\- 🧬 Returns \*\*Latin scientific names\*\* with confidence scores

\- 🧠 Designed for \*\*LLM tool usage\*\* via Model Context Protocol (MCP)

\- 🔌 Simple stdio-based MCP server

\- 🚀 Easy to run with `npx`

\- 🔐 API key via environment variables



---



\## Supported Categories



\- `plant`

\- `bug`

\- `bird`

\- `mammal`

\- `reptile`

\- `amphibian`

\- `mollusc`

\- `fungi`



---



\## Installation



```bash

npm install 

```



\*\*Configure in your MCP client:\*\*

```json

{
  "mcp.servers": {
    "nature-vision": {
      "command": "npx",
      "args": ["-y", "nature-vision-mcp"],
      "env": {
        "NATURE_VISION_API_KEY": "app-xxx"
      }
    }
  }
}


```



```bash

npx nature-vision-mcp



