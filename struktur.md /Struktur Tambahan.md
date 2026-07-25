# Struktur Tambahan (Lengkap) — root ke `applications/`

Semua folder sekarang ada isinya, gak ada yang kosong.

```
applications/
│
├── Workflow/
│   ├── WorkflowAPI.ts
│   ├── WorkflowApp.tsx
│   ├── WorkflowHooks.ts
│   ├── WorkflowStore.ts
│   ├── WorkflowStyles.css
│   ├── WorkflowTypes.ts
│   ├── WorkflowWindow.tsx
│   ├── Canvas/
│   │   ├── InfiniteCanvas.tsx
│   │   ├── Grid.tsx
│   │   ├── Camera.tsx
│   │   ├── Zoom.tsx
│   │   └── Selection.tsx
│   ├── Nodes/
│   │   ├── TaskNode.tsx
│   │   ├── BranchNode.tsx
│   │   ├── DelayNode.tsx
│   │   ├── DecisionNode.tsx
│   │   ├── LoopNode.tsx
│   │   ├── VariableNode.tsx
│   │   ├── MergeNode.tsx
│   │   ├── StartNode.tsx
│   │   └── EndNode.tsx
│   ├── Connections/
│   │   ├── Edge.tsx
│   │   ├── SmartRouting.ts
│   │   ├── EdgeLabel.tsx
│   │   └── EdgeAnimation.tsx
│   ├── Panels/
│   │   ├── Inspector.tsx
│   │   ├── NodeLibrary.tsx
│   │   ├── Variables.tsx
│   │   ├── Console.tsx
│   │   ├── Search.tsx
│   │   └── Layers.tsx
│   ├── Timeline/
│   │   ├── History.ts
│   │   ├── Undo.ts
│   │   └── Redo.ts
│   ├── Export/
│   │   ├── PNG.ts
│   │   ├── SVG.ts
│   │   └── JSON.ts
│   ├── Simulation/
│   │   ├── Executor.ts
│   │   ├── Debugger.ts
│   │   └── Breakpoint.ts
│   ├── Widgets/
│   │   ├── NodePreviewCard.tsx
│   │   └── VariableChip.tsx
│   └── index.ts
│
├── Whiteboard/
│   ├── WhiteboardAPI.ts
│   ├── WhiteboardApp.tsx
│   ├── WhiteboardHooks.ts
│   ├── WhiteboardStore.ts
│   ├── WhiteboardStyles.css
│   ├── WhiteboardTypes.ts
│   ├── WhiteboardWindow.tsx
│   ├── Canvas/
│   │   ├── InfiniteCanvas.tsx
│   │   ├── Grid.tsx
│   │   ├── Camera.tsx
│   │   ├── Zoom.tsx
│   │   └── Background.tsx
│   ├── Layers/
│   │   ├── LayerPanel.tsx
│   │   ├── LayerItem.tsx
│   │   ├── LayerGroup.tsx
│   │   ├── LayerOrder.ts
│   │   ├── LayerVisibility.ts
│   │   └── LayerLock.ts
│   ├── Objects/
│   │   ├── StickyNote.tsx
│   │   ├── Rectangle.tsx
│   │   ├── Ellipse.tsx
│   │   ├── Arrow.tsx
│   │   ├── Text.tsx
│   │   ├── Frame.tsx
│   │   ├── Image.tsx
│   │   ├── Icon.tsx
│   │   └── Video.tsx
│   ├── Selection/
│   │   ├── Marquee.ts
│   │   ├── MultiSelect.ts
│   │   ├── HitTest.ts
│   │   ├── Hover.ts
│   │   ├── SelectionBox.tsx
│   │   └── SelectionHandles.tsx
│   ├── History/
│   │   ├── UndoRedo.ts
│   │   ├── CommandStack.ts
│   │   └── Snapshot.ts
│   ├── Collisions/
│   │   ├── CollisionDetection.ts
│   │   ├── BoundingBox.ts
│   │   └── Overlap.ts
│   ├── Snapping/
│   │   ├── SnapToGrid.ts
│   │   ├── SnapToObject.ts
│   │   ├── SmartGuides.ts
│   │   └── SnapThreshold.ts
│   ├── Rulers/
│   │   ├── HorizontalRuler.tsx
│   │   ├── VerticalRuler.tsx
│   │   └── RulerMarker.tsx
│   ├── Guides/
│   │   ├── GuideLine.tsx
│   │   ├── GuideManager.ts
│   │   └── AlignmentGuide.ts
│   ├── Templates/
│   │   ├── TemplateGallery.tsx
│   │   ├── TemplateItem.tsx
│   │   ├── TemplateLoader.ts
│   │   └── TemplateCategories.ts
│   ├── Widgets/
│   │   ├── ColorSwatch.tsx
│   │   └── ObjectThumbnail.tsx
│   └── index.ts
│
├── DatabaseDesigner/
│   ├── DatabaseDesignerAPI.ts
│   ├── DatabaseDesignerApp.tsx
│   ├── DatabaseDesignerHooks.ts
│   ├── DatabaseDesignerStore.ts
│   ├── DatabaseDesignerStyles.css
│   ├── DatabaseDesignerTypes.ts
│   ├── DatabaseDesignerWindow.tsx
│   ├── Canvas/
│   │   ├── InfiniteCanvas.tsx
│   │   ├── Grid.tsx
│   │   ├── Camera.tsx
│   │   └── Zoom.tsx
│   ├── Tables/
│   │   ├── TableNode.tsx
│   │   ├── TableHeader.tsx
│   │   ├── ColumnRow.tsx
│   │   ├── AddColumnButton.tsx
│   │   └── TableContextMenu.tsx
│   ├── Relationships/
│   │   ├── RelationshipLine.tsx
│   │   ├── ForeignKeyEdge.tsx
│   │   ├── CardinalityLabel.tsx
│   │   └── RelationshipEditor.tsx
│   ├── Indexes/
│   │   ├── IndexList.tsx
│   │   ├── IndexEditor.tsx
│   │   └── IndexTypeSelector.tsx
│   ├── Constraints/
│   │   ├── ConstraintList.tsx
│   │   ├── ConstraintEditor.tsx
│   │   ├── CheckConstraint.tsx
│   │   └── UniqueConstraint.tsx
│   ├── Views/
│   │   ├── ViewList.tsx
│   │   ├── ViewEditor.tsx
│   │   └── ViewPreview.tsx
│   ├── Triggers/
│   │   ├── TriggerList.tsx
│   │   ├── TriggerEditor.tsx
│   │   └── TriggerCondition.tsx
│   ├── Functions/
│   │   ├── FunctionList.tsx
│   │   ├── FunctionEditor.tsx
│   │   └── FunctionParams.tsx
│   ├── Inspector/
│   │   ├── TableInspector.tsx
│   │   ├── ColumnInspector.tsx
│   │   └── RelationshipInspector.tsx
│   ├── MiniMap/
│   │   ├── MiniMap.tsx
│   │   └── MiniMapViewport.tsx
│   ├── SQLGenerator/
│   │   ├── PostgresGenerator.ts
│   │   ├── MySQLGenerator.ts
│   │   ├── SQLiteGenerator.ts
│   │   └── DDLBuilder.ts
│   ├── Import/
│   │   ├── SQLImporter.ts
│   │   ├── CSVImporter.ts
│   │   └── SchemaImporter.ts
│   ├── Export/
│   │   ├── SQLExporter.ts
│   │   ├── PNGExporter.ts
│   │   └── JSONExporter.ts
│   ├── Validation/
│   │   ├── SchemaValidator.ts
│   │   ├── NamingRules.ts
│   │   └── TypeValidator.ts
│   ├── Migration/
│   │   ├── MigrationGenerator.ts
│   │   ├── MigrationDiff.ts
│   │   └── MigrationHistory.ts
│   ├── Templates/
│   │   ├── SchemaTemplates.ts
│   │   └── TemplateGallery.tsx
│   ├── Widgets/
│   │   └── TableCard.tsx
│   └── index.ts
│
├── SystemDesigner/
│   ├── SystemDesignerAPI.ts
│   ├── SystemDesignerApp.tsx
│   ├── SystemDesignerHooks.ts
│   ├── SystemDesignerStore.ts
│   ├── SystemDesignerStyles.css
│   ├── SystemDesignerTypes.ts
│   ├── SystemDesignerWindow.tsx
│   ├── Components/
│   │   ├── Frontend/
│   │   │   ├── ReactNode.tsx
│   │   │   ├── VueNode.tsx
│   │   │   ├── AngularNode.tsx
│   │   │   └── StaticSiteNode.tsx
│   │   ├── Backend/
│   │   │   ├── NodeJSNode.tsx
│   │   │   ├── PythonNode.tsx
│   │   │   ├── GoNode.tsx
│   │   │   └── JavaNode.tsx
│   │   ├── API/
│   │   │   ├── RESTApiNode.tsx
│   │   │   └── GraphQLApiNode.tsx
│   │   ├── Redis/
│   │   │   ├── RedisNode.tsx
│   │   │   └── RedisClusterNode.tsx
│   │   ├── Kafka/
│   │   │   ├── KafkaNode.tsx
│   │   │   └── KafkaTopicNode.tsx
│   │   ├── RabbitMQ/
│   │   │   ├── RabbitMQNode.tsx
│   │   │   └── QueueNode.tsx
│   │   ├── Docker/
│   │   │   ├── DockerContainerNode.tsx
│   │   │   └── DockerComposeNode.tsx
│   │   ├── Kubernetes/
│   │   │   ├── PodNode.tsx
│   │   │   ├── ServiceNode.tsx
│   │   │   ├── IngressNode.tsx
│   │   │   └── DeploymentNode.tsx
│   │   ├── CDN/
│   │   │   ├── CDNNode.tsx
│   │   │   └── EdgeCacheNode.tsx
│   │   ├── Gateway/
│   │   │   ├── APIGatewayNode.tsx
│   │   │   └── LoadBalancerNode.tsx
│   │   ├── Worker/
│   │   │   ├── WorkerNode.tsx
│   │   │   └── CronJobNode.tsx
│   │   ├── Storage/
│   │   │   ├── S3Node.tsx
│   │   │   ├── BlobStorageNode.tsx
│   │   │   └── FileSystemNode.tsx
│   │   ├── Database/
│   │   │   ├── PostgresNode.tsx
│   │   │   ├── MySQLNode.tsx
│   │   │   ├── MongoNode.tsx
│   │   │   └── DynamoDBNode.tsx
│   │   └── Cloud/
│   │       ├── AWSNode.tsx
│   │       ├── GCPNode.tsx
│   │       └── AzureNode.tsx
│   ├── Connections/
│   │   ├── REST.ts
│   │   ├── GraphQL.ts
│   │   ├── Websocket.ts
│   │   ├── gRPC.ts
│   │   ├── TCP.ts
│   │   ├── UDP.ts
│   │   ├── Queue.ts
│   │   └── Pipeline.ts
│   ├── Inspector/
│   │   ├── Color.tsx
│   │   ├── Status.tsx
│   │   ├── Health.tsx
│   │   ├── Environment.tsx
│   │   ├── Ports.tsx
│   │   ├── Variables.tsx
│   │   ├── Dependencies.tsx
│   │   └── Metadata.tsx
│   ├── Widgets/
│   │   └── ComponentCard.tsx
│   └── index.ts
│
├── APIStudio/
│   ├── APIStudioAPI.ts
│   ├── APIStudioApp.tsx
│   ├── APIStudioHooks.ts
│   ├── APIStudioStore.ts
│   ├── APIStudioStyles.css
│   ├── APIStudioTypes.ts
│   ├── APIStudioWindow.tsx
│   ├── Collections/
│   │   ├── CollectionTree.tsx
│   │   ├── CollectionItem.tsx
│   │   ├── FolderItem.tsx
│   │   └── CollectionContextMenu.tsx
│   ├── Environment/
│   │   ├── EnvironmentSwitcher.tsx
│   │   ├── EnvironmentEditor.tsx
│   │   └── EnvironmentList.tsx
│   ├── Variables/
│   │   ├── VariableList.tsx
│   │   ├── VariableEditor.tsx
│   │   └── GlobalVariables.ts
│   ├── Authentication/
│   │   ├── OAuth/
│   │   │   ├── OAuthFlow.tsx
│   │   │   └── OAuthTokenViewer.tsx
│   │   ├── Bearer/
│   │   │   └── BearerTokenInput.tsx
│   │   └── Cookies/
│   │       └── CookieManager.tsx
│   ├── Request/
│   │   ├── Headers/
│   │   │   └── HeaderEditor.tsx
│   │   ├── Params/
│   │   │   └── ParamsEditor.tsx
│   │   ├── Body/
│   │   │   ├── JSONBody.tsx
│   │   │   ├── RawBody.tsx
│   │   │   └── FormBody.tsx
│   │   └── Multipart/
│   │       └── MultipartEditor.tsx
│   ├── History/
│   │   ├── RequestHistory.tsx
│   │   ├── HistoryItem.tsx
│   │   └── HistorySearch.tsx
│   ├── Response/
│   │   ├── ResponseViewer.tsx
│   │   ├── ResponseHeaders.tsx
│   │   ├── ResponseBody.tsx
│   │   ├── ResponseStatus.tsx
│   │   └── ResponseTime.tsx
│   ├── Console/
│   │   ├── NetworkConsole.tsx
│   │   └── LogViewer.tsx
│   ├── Assertions/
│   │   ├── AssertionBuilder.tsx
│   │   ├── AssertionList.tsx
│   │   └── AssertionRunner.ts
│   ├── Tests/
│   │   ├── TestRunner.ts
│   │   ├── TestEditor.tsx
│   │   └── TestResults.tsx
│   ├── Scripts/
│   │   ├── PreRequestScript.tsx
│   │   ├── PostResponseScript.tsx
│   │   └── ScriptEditor.tsx
│   ├── MockServer/
│   │   ├── MockServerConfig.tsx
│   │   ├── MockRoute.tsx
│   │   └── MockResponse.tsx
│   ├── Widgets/
│   │   └── RequestCard.tsx
│   └── index.ts
│
└── ComponentBuilder/
    ├── ComponentBuilderAPI.ts
    ├── ComponentBuilderApp.tsx
    ├── ComponentBuilderHooks.ts
    ├── ComponentBuilderStore.ts
    ├── ComponentBuilderStyles.css
    ├── ComponentBuilderTypes.ts
    ├── ComponentBuilderWindow.tsx
    ├── Library/
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Modal.tsx
    │   ├── Input.tsx
    │   ├── Tabs.tsx
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   ├── Dropdown.tsx
    │   ├── Avatar.tsx
    │   ├── Badge.tsx
    │   ├── Toast.tsx
    │   ├── Alert.tsx
    │   ├── Table.tsx
    │   ├── Tree.tsx
    │   ├── Timeline.tsx
    │   ├── Editor.tsx
    │   ├── Markdown.tsx
    │   └── CanvasPreview.tsx
    ├── Property/
    │   ├── Padding.tsx
    │   ├── Margin.tsx
    │   ├── Border.tsx
    │   ├── Radius.tsx
    │   ├── Shadow.tsx
    │   ├── Flex.tsx
    │   ├── Grid.tsx
    │   ├── Animation.tsx
    │   ├── Typography.tsx
    │   ├── Color.tsx
    │   ├── State.tsx
    │   └── Accessibility.tsx
    ├── Preview/
    │   ├── LivePreview.tsx
    │   ├── PreviewControls.tsx
    │   ├── ResponsivePreview.tsx
    │   └── DeviceFrame.tsx
    ├── ExportReact/
    │   ├── CodeExporter.ts
    │   ├── JSXGenerator.ts
    │   ├── PropsGenerator.ts
    │   └── DownloadZip.ts
    ├── Widgets/
    │   └── ComponentThumbnail.tsx
    └── index.ts
```

## Catatan

- `ComponentBuilder/Library/Canvas.tsx` gue rename jadi `CanvasPreview.tsx` biar gak bentrok makna sama infinite-canvas di Workflow/Whiteboard.
- `Whiteboard/Templates/TemplateGallery.tsx` vs `DatabaseDesigner/Templates/TemplateGallery.tsx` — dua-duanya lokal per app, wajar beda isi (template shape vs template schema).
- Kalau kedepannya lu liat pola yang persis sama di 2+ app (misal `TemplateGallery.tsx` ternyata cuma beda data), itu kandidat naik ke `shared/components/`.
