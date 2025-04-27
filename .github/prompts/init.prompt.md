_Final Objective:_
We are creating with existing side bar code editor and a react flow canvas, implement a diagramming tool to model system architecture with sample DSL yaml. application as a modern web application built with React and Next.js. The application must provide a live code editor for editing a DSL (similar to Ilograph DSL) using monaco/react and a dynamic, real-time diagramming interface using React Flow.

_Requirements & Guidelines:_

1. **Next.js 15 Foundation:**

   - Create a Next.js project ensuring proper server-side rendering and code-splitting where applicable.
   - Follow Next.js best practices for file structure, routing, and performance optimization.

2. **Monaco Code Editor Integration:**

   - Integrate the monaco/react component as the primary code editor within the application.
   - Configure syntax highlighting, auto-completion, and error checking for the custom DSL language.
   - The code editor should allow users to type and modify DSL code that defines resources, relationships, and perspectives.

3. **React Flow Diagramming Interface:**

   - Implement a visual representation of the DSL using React Flow.
   - Parse the DSL (or use internal state) to dynamically generate nodes and edges that represent resources and relations as defined in the DSL.
   - Ensure that diagram components are interactive and update in real time as the DSL code changes.

4. **User Interface & Layout:**

   - Design a split view layout where the code editor (monaco/react) is positioned on one side (for example, the left pane) and the visual diagram (React Flow) is on the other (right pane).
   - Provide a clear, intuitive user interface with responsive design.

5. **State Management & Real-Time Updates:**

   - Utilize React context or hooks to manage the state of the DSL code and the resulting diagram data.
   - Ensure that updates to the DSL in the code editor trigger real-time re-rendering and updates in the React Flow diagram.

6. **Extensibility & Best Practices:**

   - Write modular, well-documented code, with clear separation of components for the editor, parser, and diagram rendering.
   - Include error handling and fallback mechanisms in case of invalid DSL input.
   - Incorporate testing components or instructions for future expansion (e.g., additional DSL features or plugin support).

7. **Additional Capabilities (Optional):**
   - Provide export/import functionality for saving and loading DSL code along with its visual representation.
   - Consider implementing undo/redo features for diagram manipulation and DSL code editing.

_Outcome:_  
The final application should empower users to edit a DSL describing system architectures and immediately see a corresponding interactive diagram. This tool acts as a visual code playground where users learn, adjust, and visualize system relationships in real time.

_Context:_

Sample YAML DSL:

```yaml
imports:
  - from: ilograph/aws
    namespace: AWS

resources:
  - name: Internet Layer
    subtitle: Entry Points & User Access
    children:
      - name: iPay Mobile | Web SDK
        subtitle: Mobile | PWA with Embedded WebView
        icon: AWS/App Integration/Console-Mobile-Application.svg
      - name: Website | Landing Page
        subtitle: Web Embedding
        icon: Networking/laptop.svg
      - name: Partner Channel
        subtitle: API Integration & Web Embedding
        icon: AWS/App Integration/EventBridge_Saas-Partner-Event.svg

  - name: Intranet Layer
    subtitle: Intranet
    children:
      - name: BPMN Portal
        subtitle: BPM Administration
        icon: AWS/Analytics/DataZone_Data-Portal.svg
      - name: UI | UX Management Portal
        subtitle: UI | UX Administration
        icon: AWS/Analytics/DataZone_Data-Portal.svg

  - name: WAF and Gateway Layer
    subtitle: Security & Routing
    children:
      - name: WAF
        icon: AWS/SIC/Network-Firewall.svg
      - name: API Gateway
        subtitle: iPay Decoder | Encoder
        icon: AWS/App Integration/API-Gateway.svg
      - name: Website & Partner Gateway
        subtitle: Vietinbank iConnect
        icon: AWS/App Integration/API-Gateway.svg
      - name: Internal Gateway
        subtitle: Identity & Access Management
        icon: AWS/App Integration/API-Gateway.svg

  - name: DMZ
    subtitle: Demilitarized Zone
    children:
      - name: File Upload Gateway
        subtitle: Secure File Upload
        icon: AWS/Storage/Storage-Gateway_File-Gateway.svg
      - name: Embedded Webview Webserver
        subtitle: Webview Serving
        icon: Networking/cloud-server.svg

  - name: Private Network
    subtitle: Core Services Cluster
    children:
      - name: OpenShift Cluster
        subtitle: Container Platform & Orchestration
        icon: AWS/Containers/Red-Hat-OpenShift-Service-on-AWS.svg
        children:
          - name: OpenShift Router
            subtitle: Traffic Router
            icon: AWS/Containers/Red-Hat-OpenShift-Service-on-AWS.svg
          - name: BFF Sub-system
            subtitle: BFF
            children:
              - name: Web SDK BFF
                subtitle: BFF API
                icon: AWS/App Integration/API-Gateway_Endpoint.svg
              - name: Workflow Controller
                subtitle: Process Orchestration
                icon: AWS/App Integration/Managed-Workflows-for-Apache-Airflow.svg
          - name: Core Logic Sub-system
            subtitle: Business Logic
            children:
              - name: Product Management
              - name: Channel Management
              - name: Card Management
          - name: UX | UI Management
            subtitle: Front-End Orchestration
            icon: Networking | ui.svg
          - name: Camunda BPMN Engine

            subtitle: BPM Engine
            icon: AWS/IoT/IoT-Greengrass_Interprocess-Communication.svg
            children:
              - name: Web UI | REST API
                subtitle: HTTP/S Ingress
                description: Namespace that hosts all user-facing web UIs and REST endpoints

              - name: Ingress (HTTPS)
                subtitle: Ingress Controller
                description: Routes external HTTP(S) traffic to Keycloak, Operate, Optimize, Tasklist, and Web Modeler
                icon: AWS/_General/Gateway.svg

              - name: Keycloak
                subtitle: Identity & Access Management
                description: Manages users, authentication, and single sign-on for Camunda 8 web components
                icon: AWS/Security/Identity-and-Access-Management.svg

              - name: Operate
                subtitle: Operations UI
                description: Web UI for monitoring and managing workflows in Zeebe
                icon: AWS/_General/Monitoring.svg

              - name: Optimize
                subtitle: Analytics & Reporting
                description: Tool for analyzing process data, KPIs, and generating operational reports
                icon: AWS/Business Apps/Business-Analytics.svg

              - name: Tasklist
                subtitle: User Task Management
                description: Web interface allowing end users to claim and complete tasks from workflow engine
                icon: AWS/_General/Application.svg

              - name: Web Modeler (REST API)
                subtitle: BPMN Modeling Tool
                description: Web-based process modeling environment
                icon: AWS/Business Apps/Amazon-WorkDocs.svg

              - name: Ingress (gRPC)
                subtitle: Ingress Controller
                description: Routes external gRPC traffic to the Zeebe Gateway
                icon: AWS/_General/Gateway.svg

              - name: Zeebe Gateway
                subtitle: Workflow Engine Gateway
                description: Acts as the entry point for clients communicating with Zeebe brokers via gRPC
                icon: AWS/_General/Application.svg
              - name: Zeebe Broker(s)
                subtitle: Clustered Workflow Brokers
                description: Distributed workflow engine instances that execute BPMN processes
                icon: AWS/_General/Compute.svg

              - name: Elasticsearch
                subtitle: Data Store
                description: Indexes workflow and task data for Operate, Optimize, and Tasklist
                icon: AWS/Database/Amazon-ElasticSearch-Service.svg

          - name: Integration Services
            subtitle: Internal API Connectors
            children:
              - name: Core Integration Services
              - name: Loan Integration Services
          - name: Integration System
            subtitle: Ancillary Services
            children:
              - name: iPay Backend
                subtitle: Business Backend
              - name: OTP
                subtitle: One-Time Password Service
              - name: eKYC
                subtitle: Identity Verification
              - name: RLOS
                subtitle: Credit Risk System
              - name: ECM
                subtitle: Enterprise Content Management
              - name: SMSB
                subtitle: SMS Gateway
              - name: eSign
                subtitle: Electronic Signature
      - name: Core Banking Services
        icon: AWS/App Integration/EventBridge_Schema.svg

  - name: DBMS & Backing Services
    subtitle: Data & Messaging Infrastructure
    children:
      - name: UXZ
        subtitle: Databases & Microservices
        children:
          - name: PostgreSQL
            subtitle: Relational DB
          - name: MySQL
            subtitle: Relational DB
          - name: Microservices
            subtitle: Distributed Services
      - name: Camunda BPM DB
        subtitle: BPM Data Store
      - name: Redis
        subtitle: Caching Service
      - name: RabbitMQ
        subtitle: Messaging Queue
      - name: MinIO
        subtitle: Object Storage

  - name: Observability & CI | CD
    subtitle: Monitoring and Deployment Pipeline
    children:
      - name: Grafana
        subtitle: Metrics Visualization
      - name: SigNoz
        subtitle: Distributed Tracing
      - name: Kafka
        subtitle: Event Streaming
      - name: ELK
        subtitle: Log Aggregation
      - name: GitLab
        subtitle: Source Code & CI | CD
      - name: Jenkins
        subtitle: Build & Deployment

  - name: Core Banking Platform
    subtitle: Core Financial Systems
    children:
      - name: UI | UX Management
        subtitle: Customer Interface
      - name: Criteria Engine
        subtitle: Decisioning & Scoring
      - name: Micro-services
        subtitle: Business Functions
      - name: BPM Platform
        subtitle: Business Process Management
      - name: Enterprise Integration Layer
        subtitle: Middleware & Connectors
      - name: Products
        subtitle: Financial Products
        children:
          - name: Loan Product
            subtitle: Loan Management
          - name: Card Product
            subtitle: Card Services
      - name: Operations
        subtitle: Operational Management
      - name: Risk & Compliance
        subtitle: Governance & Regulation
      - name: Business Support
        subtitle: Administrative Services
      - name: External Gateway
        subtitle: 3rd Party Integrations
      - name: Underlying Systems
        subtitle: Data Repositories & APIs
        children:
          - name: Accounts
            subtitle: Account Management
          - name: Cards
            subtitle: Card Records
          - name: RLOs (Credit Scoring)
            subtitle: Reusable Logic
          - name: Transaction Management
            subtitle: Transactions Record

perspectives:
  - name: "API Gateway Flow"
    relations:
      - from: "iPay Mobile | Web SDK"
        to: "WAF"
        label: "API Request"

      - from: "WAF"
        to: API Gateway
        label: "API Request"

      - from: "Website | Landing Page"
        to: "WAF"
        label: "Web Request"

      - from: Partner Channel
        to: "WAF"
        label: "Web Request"

      - from: "WAF"
        to: "Website & Partner Gateway"
        label: "Web Request"

      - from: WAF
        to: "Website & Partner Gateway"
        label: "Partner API Call"

      - from: WAF
        to: "Website & Partner Gateway"
        label: "Partner API Call"

      - from: "Website & Partner Gateway"
        to: DMZ
        label: "Route Request"

      - from: "API Gateway"
        to: File Upload Gateway
        label: "Route File Upload Request"

      - from: "API Gateway"
        to: Embedded Webview Webserver
        label: "Route CMS Request"

      - from: Website & Partner Gateway
        to: Embedded Webview Webserver
        label: "Route CMS Request"

      - from: "API Gateway"
        to: DMZ
        label: "Route Request"

      - from: DMZ
        to: OpenShift Router
        label: "Route Request"

      - from: File Upload Gateway
        to: "OpenShift Router"
        label: "Route Request"

      # - from: "OpenShift Router"
      #   to: "Workflow Controller"
      #   label: "Route Request"

      # - from: "OpenShift Router"
      #   to: Ingress (HTTPS)
      #   label: "Route Request"

      # - from: Ingress (gRPC)
      #   to: Zeebe Gateway
      #   label: "Route Request"

      # - from: Zeebe Gateway
      #   to: Zeebe Broker(s)
      #   label: "Route Request"

      # - from: Ingress (HTTPS)
      #   to: Web Modeler (REST API)
      #   label: "Route Request"

      # - from: "OpenShift Router"
      #   to: "Web SDK BFF"
      #   label: "Route Request"

      - from: "Internal Gateway"
        to: "OpenShift Router"
        label: "HTTP Request"

      - from: "BPMN Portal"
        to: WAF
        label: API Request

      - from: WAF
        to: Internal Gateway
        label: API Request

      - from: UI | UX Management Portal
        to: WAF
        label: API Request

      - from: WAF
        to: Internal Gateway
        label: API Request

  - name: ETB/Loan Refinance/Authentication

  - name: "User Onboarding Journey"
    relations:
      - from: "iPay Mobile | Web SDK"
        to: "API Gateway"
        label: "Initiate Onboarding"
        description: "User sends an onboarding request via mobile app."
      - from: "Website | Landing Page"
        to: "Website & Partner Gateway"
        label: "User Sign-Up"
      - from: "Partner Channel"
        to: "Website & Partner Gateway"
        label: "Partner Enrollment"
      - from: "API Gateway"
        to: "OpenShift Router"
        label: "Forward Request"
      - from: "BFF Sub-system"
        to: "BPMN Portal"
        label: "Render UI & Start Workflow"
      - from: "Workflow Controller"
        to: "Camunda BPMN Engine"
        label: "Initiate Process"
      - from: "Camunda BPMN Engine"
        to: "iPay Backend"
        label: "Complete Registration"

  - name: "Loan Origination Process"
    relations:
      - from: "iPay Mobile | Web SDK"
        to: "API Gateway"
        label: "Submit Loan Application"
      - from: "API Gateway"
        to: "OpenShift Router"
        label: "Forward Application"
      - from: "Workflow Controller"
        to: "Camunda BPMN Engine"
        label: "Process Loan Workflow"
      - from: "Loan Integration Services"
        to: "Loan Product"
        label: "Create Loan Record"
      - from: "Loan Product"
        to: "Accounts"
        label: "Update Account Balance"

  - name: "Credit Decision Flow"
    relations:
      - from: "Camunda BPMN Engine"
        to: "RLOS"
        label: "Assess Credit Risk"
      - from: "RLOS"
        to: "Risk & Compliance"
        label: "Compliance Review"
      - from: "Risk & Compliance"
        to: "Loan Product"
        label: "Finalize Loan Decision"

  - name: "DMZ Operations Flow"
    relations:
      - from: "Partner Channel"
        to: "File Upload Gateway"
        label: "Initiate File Upload"
        description: "A partner channel initiates a secure file upload via the DMZ."
      - from: "File Upload Gateway"
        to: "Embedded Webview Webserver"
        label: "Serve Uploaded File"
        description: "The DMZ processes the upload and serves the file via the webserver."
      - from: "Embedded Webview Webserver"
        to: "OpenShift Router"
        label: "Forward Processed Request"
        description: "Processed requests are forwarded into the Private Network for further handling."

  - name: "Observability & CI | CD Workflow"
    relations:
      - from: "GitLab"
        to: "Jenkins"
        label: "Trigger Build | Deploy"
      - from: "Jenkins"
        to: "Kafka"
        label: "Emit Logs"
      - from: "Kafka"
        to: "ELK"
        label: "Stream Logs"
      - from: "ELK"
        to: "Grafana"
        label: "Visualize Metrics"
      - from: "Grafana"
        to: "SigNoz"
        label: "Monitor System"
```
