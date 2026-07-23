# ONYX Engineering Workstation v2 — Full Project Structure (Gabungan Part 1–5)

Filosofi alur: `landing → auth → boot → desktop → applications → actions → workflow → reports`

```
trace/
└── apps/
    ├── server/
    │   └── src/
    │       │
    │       ├── auth/
    │       │   ├── githubOAuth.ts
    │       │   ├── session.ts
    │       │   ├── permissions.ts
    │       │   ├── middleware.ts
    │       │   ├── csrf.ts
    │       │   ├── jwt.ts
    │       │   ├── cookies.ts
    │       │   ├── scopes.ts
    │       │   ├── refresh.ts
    │       │   ├── revoke.ts
    │       │   └── index.ts
    │       │
    │       ├── webhook/
    │       │   ├── verify.ts
    │       │   ├── parser.ts
    │       │   ├── dispatcher.ts
    │       │   ├── retry.ts
    │       │   ├── queue.ts
    │       │   ├── logger.ts
    │       │   ├── onPush.ts
    │       │   ├── onPullRequest.ts
    │       │   ├── onReview.ts
    │       │   ├── onIssue.ts
    │       │   ├── onRelease.ts
    │       │   ├── onCheckRun.ts
    │       │   ├── onWorkflow.ts
    │       │   ├── onMember.ts
    │       │   ├── onLabel.ts
    │       │   ├── onMilestone.ts
    │       │   └── index.ts
    │       │
    │       ├── websocket/
    │       │   ├── activity.ts
    │       │   ├── dashboard.ts
    │       │   ├── notifications.ts
    │       │   ├── repository.ts
    │       │   ├── pullRequests.ts
    │       │   ├── reviews.ts
    │       │   ├── issues.ts
    │       │   ├── team.ts
    │       │   ├── reports.ts
    │       │   ├── heartbeat.ts
    │       │   ├── broadcast.ts
    │       │   ├── rooms.ts
    │       │   └── index.ts
    │       │
    │       ├── db/
    │       │   ├── client.ts
    │       │   ├── schema.ts
    │       │   ├── migrations.ts
    │       │   ├── seed.ts
    │       │   ├── queries.ts
    │       │   ├── transactions.ts
    │       │   ├── indexes.ts
    │       │   ├── cache.ts
    │       │   └── index.ts
    │       │
    │       ├── scoring/
    │       │   ├── reviewHealth.ts
    │       │   ├── reviewerLoad.ts
    │       │   ├── mergeWithoutReview.ts
    │       │   ├── staleRadar.ts
    │       │   ├── reviewTimeline.ts
    │       │   ├── reciprocityGap.ts
    │       │   ├── issueGraveyard.ts
    │       │   ├── commitDecay.ts
    │       │   ├── weekendHeatmap.ts
    │       │   ├── busFactor.ts
    │       │   ├── activityScore.ts
    │       │   ├── ownershipScore.ts
    │       │   ├── repositoryHealth.ts
    │       │   ├── releaseRisk.ts
    │       │   └── index.ts
    │       │
    │       ├── actions/
    │       │   ├── pullRequests/
    │       │   │   ├── approve.ts
    │       │   │   ├── requestChanges.ts
    │       │   │   ├── comment.ts
    │       │   │   ├── merge.ts
    │       │   │   ├── squash.ts
    │       │   │   ├── rebase.ts
    │       │   │   ├── close.ts
    │       │   │   ├── reopen.ts
    │       │   │   ├── assignReviewer.ts
    │       │   │   ├── removeReviewer.ts
    │       │   │   ├── addLabel.ts
    │       │   │   ├── removeLabel.ts
    │       │   │   ├── convertDraft.ts
    │       │   │   ├── readyForReview.ts
    │       │   │   └── index.ts
    │       │   │
    │       │   ├── issues/
    │       │   │   ├── create.ts
    │       │   │   ├── close.ts
    │       │   │   ├── reopen.ts
    │       │   │   ├── comment.ts
    │       │   │   ├── assign.ts
    │       │   │   ├── unassign.ts
    │       │   │   ├── addLabel.ts
    │       │   │   ├── removeLabel.ts
    │       │   │   ├── milestone.ts
    │       │   │   ├── pin.ts
    │       │   │   └── index.ts
    │       │   │
    │       │   ├── repository/
    │       │   │   ├── createBranch.ts
    │       │   │   ├── deleteBranch.ts
    │       │   │   ├── compareBranch.ts
    │       │   │   ├── createRelease.ts
    │       │   │   ├── archive.ts
    │       │   │   ├── fork.ts
    │       │   │   └── index.ts
    │       │   │
    │       │   ├── releases/
    │       │   │   ├── draft.ts
    │       │   │   ├── publish.ts
    │       │   │   ├── rollback.ts
    │       │   │   ├── notes.ts
    │       │   │   └── index.ts
    │       │   │
    │       │   ├── shared/
    │       │   │   ├── githubWriteClient.ts
    │       │   │   ├── permissionCheck.ts
    │       │   │   ├── auditLog.ts
    │       │   │   ├── rateLimit.ts
    │       │   │   ├── optimisticUpdate.ts
    │       │   │   └── index.ts
    │       │   │
    │       │   └── index.ts
    │       │
    │       ├── workflow/
    │       │   ├── reviewQueue.ts
    │       │   ├── reviewPriority.ts
    │       │   ├── suggestedReviewer.ts
    │       │   ├── reviewerBalancer.ts
    │       │   ├── mergeChecklist.ts
    │       │   ├── releaseChecklist.ts
    │       │   ├── duplicateIssue.ts
    │       │   ├── relatedPR.ts
    │       │   ├── relatedIssue.ts
    │       │   ├── dependencyMap.ts
    │       │   ├── ownershipMap.ts
    │       │   ├── branchHealth.ts
    │       │   ├── repositoryHealth.ts
    │       │   ├── workRecommendation.ts
    │       │   ├── nextAction.ts
    │       │   ├── dailyFocus.ts
    │       │   ├── smartNotifications.ts
    │       │   └── index.ts
    │       │
    │       ├── automation/
    │       │   ├── triggers.ts
    │       │   ├── rules.ts
    │       │   ├── scheduler.ts
    │       │   ├── conditions.ts
    │       │   ├── actions.ts
    │       │   ├── execution.ts
    │       │   ├── logs.ts
    │       │   ├── templates.ts
    │       │   └── index.ts
    │       │
    │       ├── search/
    │       │   ├── repositories.ts
    │       │   ├── pullRequests.ts
    │       │   ├── reviews.ts
    │       │   ├── issues.ts
    │       │   ├── commits.ts
    │       │   ├── contributors.ts
    │       │   ├── releases.ts
    │       │   ├── global.ts
    │       │   └── index.ts
    │       │
    │       ├── services/
    │       │   ├── github.ts
    │       │   ├── analytics.ts
    │       │   ├── repository.ts
    │       │   ├── releases.ts
    │       │   ├── exports.ts
    │       │   ├── storage.ts
    │       │   ├── logger.ts
    │       │   ├── cache.ts
    │       │   ├── notifications.ts
    │       │   ├── workspace.ts
    │       │   └── index.ts
    │       │
    │       ├── routes/
    │       │   ├── dashboard.ts
    │       │   ├── repository.ts
    │       │   ├── pullRequests.ts
    │       │   ├── reviews.ts
    │       │   ├── issues.ts
    │       │   ├── insights.ts
    │       │   ├── reports.ts
    │       │   ├── team.ts
    │       │   ├── activity.ts
    │       │   ├── releases.ts
    │       │   ├── search.ts
    │       │   ├── workflow.ts
    │       │   ├── automation.ts
    │       │   ├── actions.ts
    │       │   ├── notifications.ts
    │       │   ├── workspace.ts
    │       │   ├── settings.ts
    │       │   └── index.ts
    │       │
    │       └── index.ts
    │
    └── web/
        └── src/
            ├── App.tsx
            ├── main.tsx
            ├── router.tsx
            ├── index.css
            │
            ├── shared/
            │   ├── components/
            │   │   ├── EmptyState.tsx
            │   │   ├── Loading.tsx
            │   │   ├── Spinner.tsx
            │   │   ├── ErrorBoundary.tsx
            │   │   ├── Modal.tsx
            │   │   ├── Dialog.tsx
            │   │   ├── Button.tsx
            │   │   ├── Icon.tsx
            │   │   ├── Badge.tsx
            │   │   ├── Chip.tsx
            │   │   ├── ProgressBar.tsx
            │   │   ├── ScoreBar.tsx
            │   │   ├── Tooltip.tsx
            │   │   ├── Dropdown.tsx
            │   │   ├── SearchBox.tsx
            │   │   ├── Pagination.tsx
            │   │   ├── Timeline.tsx
            │   │   ├── Heatmap.tsx
            │   │   ├── ActivityCard.tsx
            │   │   ├── RepositoryCard.tsx
            │   │   ├── ReviewCard.tsx
            │   │   ├── IssueCard.tsx
            │   │   ├── EmptyWorkspace.tsx
            │   │   └── index.ts
            │   ├── hooks/
            │   │   ├── useDebounce.ts
            │   │   ├── usePagination.ts
            │   │   ├── useLocalStorage.ts
            │   │   ├── useHotkeys.ts
            │   │   ├── useTheme.ts
            │   │   ├── useWindowSize.ts
            │   │   ├── useContextMenu.ts
            │   │   └── index.ts
            │   ├── api/
            │   │   ├── client.ts
            │   │   ├── endpoints.ts
            │   │   ├── request.ts
            │   │   ├── response.ts
            │   │   ├── errorHandler.ts
            │   │   └── index.ts
            │   ├── utils/
            │   │   ├── classNames.ts
            │   │   ├── formatDate.ts
            │   │   ├── formatNumber.ts
            │   │   ├── formatDuration.ts
            │   │   ├── download.ts
            │   │   ├── clipboard.ts
            │   │   ├── debounce.ts
            │   │   └── index.ts
            │   ├── constants/
            │   │   ├── colors.ts
            │   │   ├── routes.ts
            │   │   ├── shortcuts.ts
            │   │   ├── permissions.ts
            │   │   └── index.ts
            │   └── index.ts
            │
            ├── websocket/
            │   ├── SocketProvider.tsx
            │   ├── SocketContext.tsx
            │   ├── reconnect.ts
            │   ├── events.ts
            │   ├── subscriptions.ts
            │   ├── useSocket.ts
            │   ├── useSocketEvent.ts
            │   └── index.ts
            │
            ├── theme/
            │   ├── palette.ts
            │   ├── typography.ts
            │   ├── spacing.ts
            │   ├── shadows.ts
            │   ├── animations.ts
            │   ├── icons.ts
            │   ├── sounds.ts
            │   ├── themes/
            │   │   ├── classic.ts
            │   │   ├── modern.ts
            │   │   ├── crt.ts
            │   │   ├── pixel.ts
            │   │   └── dark.ts
            │   └── index.ts
            │
            ├── landing/
            │   ├── LandingPage.tsx
            │   ├── Hero.tsx
            │   ├── Navbar.tsx
            │   ├── DesktopPreview.tsx
            │   ├── WorkflowPreview.tsx
            │   ├── FeatureGrid.tsx
            │   ├── FeatureCard.tsx
            │   ├── Screenshots.tsx
            │   ├── EngineeringFlow.tsx
            │   ├── Pricing.tsx
            │   ├── FAQ.tsx
            │   ├── Footer.tsx
            │   ├── ConnectGitHubButton.tsx
            │   ├── Documentation.tsx
            │   └── index.ts
            │
            ├── auth/
            │   ├── Login.tsx
            │   ├── OAuthCallback.tsx
            │   ├── RepositoryPicker.tsx
            │   ├── OrganizationPicker.tsx
            │   ├── Permissions.tsx
            │   ├── AuthorizeRepository.tsx
            │   ├── AuthGuard.tsx
            │   ├── SessionProvider.tsx
            │   ├── AuthState.ts
            │   ├── AuthHooks.ts
            │   └── index.ts
            │
            ├── boot/
            │   ├── BootScreen.tsx
            │   ├── BootLogo.tsx
            │   ├── BootLoader.tsx
            │   ├── BootAnimation.ts
            │   ├── BootProgress.tsx
            │   ├── BootSequence.ts
            │   ├── BootMessages.ts
            │   ├── BootSound.ts
            │   ├── ShutdownScreen.tsx
            │   ├── RestartScreen.tsx
            │   ├── CrashScreen.tsx
            │   ├── RecoveryScreen.tsx
            │   ├── BootState.ts
            │   └── index.ts
            │
            ├── desktop/
            │   ├── Desktop.tsx
            │   ├── DesktopLayout.tsx
            │   ├── DesktopBackground.tsx
            │   ├── DesktopGrid.tsx
            │   ├── DesktopIcon.tsx
            │   ├── ContextMenu.tsx
            │   ├── DesktopSearch.tsx
            │   ├── DesktopState.ts
            │   ├── Workspace.tsx
            │   ├── WorkspaceManager.ts
            │   ├── WorkspaceTemplates.ts
            │   ├── SaveWorkspace.ts
            │   ├── LoadWorkspace.ts
            │   ├── WorkspaceHistory.ts
            │   ├── RecentProjects.ts
            │   ├── FavoriteRepositories.ts
            │   ├── DesktopSettings.tsx
            │   ├── Wallpaper.tsx
            │   └── index.ts
            │
            ├── window-manager/
            │   ├── WindowManager.tsx
            │   ├── WindowRegistry.ts
            │   ├── WindowContext.tsx
            │   ├── WindowFrame.tsx
            │   ├── WindowHeader.tsx
            │   ├── WindowBody.tsx
            │   ├── WindowToolbar.tsx
            │   ├── WindowButtons.tsx
            │   ├── MenuBar.tsx
            │   ├── MenuBarItem.tsx
            │   ├── DockManager.ts
            │   ├── SplitView.ts
            │   ├── SnapLayout.ts
            │   ├── FloatingPanel.ts
            │   ├── TabGroups.ts
            │   ├── WindowHistory.ts
            │   ├── WindowPersistence.ts
            │   ├── WindowAnimation.ts
            │   ├── WindowEffects.ts
            │   ├── WindowFocus.ts
            │   ├── Open.ts
            │   ├── Close.ts
            │   ├── Minimize.ts
            │   ├── Maximize.ts
            │   ├── Restore.ts
            │   ├── Draggable.tsx
            │   ├── Resizable.tsx
            │   ├── ZIndex.ts
            │   ├── useWindow.ts
            │   └── index.ts
            │
            ├── command-palette/
            │   ├── CommandPalette.tsx
            │   ├── CommandSearch.tsx
            │   ├── CommandHistory.ts
            │   ├── CommandRegistry.ts
            │   ├── QuickActions.ts
            │   ├── FavoriteCommands.ts
            │   ├── RecentCommands.ts
            │   ├── KeyboardShortcuts.ts
            │   ├── useCommandPalette.ts
            │   └── index.ts
            │
            ├── taskbar/
            │   ├── Taskbar.tsx
            │   ├── StartButton.tsx
            │   ├── StartMenu.tsx
            │   ├── RunningApps.tsx
            │   ├── QuickLaunch.tsx
            │   ├── Tray.tsx
            │   ├── Clock.tsx
            │   ├── Calendar.tsx
            │   ├── LiveIndicator.tsx
            │   ├── RepositoryStatus.tsx
            │   ├── CpuUsage.tsx
            │   ├── MemoryUsage.tsx
            │   ├── NetworkStatus.tsx
            │   ├── NotificationCounter.tsx
            │   ├── WorkspaceSwitcher.tsx
            │   ├── SystemStatus.tsx
            │   └── index.ts
            │
            ├── terminal/
            │   ├── Terminal.tsx
            │   ├── Console.tsx
            │   ├── Prompt.tsx
            │   ├── CommandParser.ts
            │   ├── CommandRegistry.ts
            │   ├── TerminalCommands.ts
            │   ├── AutoComplete.ts
            │   ├── History.ts
            │   ├── TerminalThemes.ts
            │   ├── TerminalShortcuts.ts
            │   ├── Shell.ts
            │   ├── TerminalState.ts
            │   └── index.ts
            │
            ├── notifications/
            │   ├── NotificationManager.tsx
            │   ├── Toast.tsx
            │   ├── Popup.tsx
            │   ├── Alert.tsx
            │   ├── Confirm.tsx
            │   ├── Success.tsx
            │   ├── Warning.tsx
            │   ├── Error.tsx
            │   ├── ReviewNotification.tsx
            │   ├── PullRequestNotification.tsx
            │   ├── IssueNotification.tsx
            │   ├── MergeNotification.tsx
            │   ├── ReleaseNotification.tsx
            │   ├── NotificationCenter.tsx
            │   └── index.ts
            │
            ├── audio/
            │   ├── Boot.ts
            │   ├── Shutdown.ts
            │   ├── Notification.ts
            │   ├── Success.ts
            │   ├── Error.ts
            │   ├── Warning.ts
            │   ├── Click.ts
            │   ├── Drag.ts
            │   ├── Drop.ts
            │   ├── WindowOpen.ts
            │   ├── WindowClose.ts
            │   ├── WindowFocus.ts
            │   ├── Volume.ts
            │   ├── SoundManager.ts
            │   └── index.ts
            │
            ├── cursor/
            │   ├── CursorManager.ts
            │   ├── CursorTheme.ts
            │   ├── CursorEffects.ts
            │   ├── Arrow.ts
            │   ├── Hand.ts
            │   ├── Move.ts
            │   ├── Resize.ts
            │   ├── Busy.ts
            │   ├── Loading.ts
            │   ├── Crosshair.ts
            │   ├── Forbidden.ts
            │   └── index.ts
            │
            └── applications/
                │
                ├── Dashboard/
                │   ├── DashboardApp.tsx
                │   ├── DashboardWindow.tsx
                │   ├── DashboardHeader.tsx
                │   ├── DashboardSidebar.tsx
                │   ├── DashboardToolbar.tsx
                │   ├── DashboardOverview.tsx
                │   ├── MyWork.tsx
                │   ├── AssignedReviews.tsx
                │   ├── AssignedIssues.tsx
                │   ├── RecentRepositories.tsx
                │   ├── ActiveBranches.tsx
                │   ├── MergeQueue.tsx
                │   ├── DailySummary.tsx
                │   ├── QuickActions.tsx
                │   ├── DashboardAPI.ts
                │   ├── DashboardStore.ts
                │   ├── DashboardHooks.ts
                │   ├── DashboardStyles.css
                │   └── index.ts
                │
                ├── Repository/
                │   ├── RepositoryApp.tsx
                │   ├── RepositoryWindow.tsx
                │   ├── RepositoryHeader.tsx
                │   ├── Overview.tsx
                │   ├── Branches.tsx
                │   ├── Commits.tsx
                │   ├── Releases.tsx
                │   ├── Contributors.tsx
                │   ├── Statistics.tsx
                │   ├── BranchCompare.tsx
                │   ├── BranchGraph.tsx
                │   ├── ReleaseCenter.tsx
                │   ├── BranchManager.tsx
                │   ├── RepositoryActions.tsx
                │   ├── RepositoryAPI.ts
                │   ├── RepositoryStore.ts
                │   ├── RepositoryHooks.ts
                │   ├── RepositoryStyles.css
                │   └── index.ts
                │
                ├── PullRequests/
                │   ├── PullRequestApp.tsx
                │   ├── PullRequestWindow.tsx
                │   ├── Open.tsx
                │   ├── Draft.tsx
                │   ├── WaitingReview.tsx
                │   ├── Merged.tsx
                │   ├── Closed.tsx
                │   ├── Timeline.tsx
                │   ├── ReviewTimeline.tsx
                │   ├── ChangedFiles.tsx
                │   ├── FileDiff.tsx
                │   ├── ReviewerPanel.tsx
                │   ├── Labels.tsx
                │   ├── MergePanel.tsx
                │   ├── MergeChecklist.tsx
                │   ├── RiskAnalysis.tsx
                │   ├── SuggestedReviewers.tsx
                │   ├── SmartActions.tsx
                │   ├── ApproveButton.tsx
                │   ├── RequestChangesButton.tsx
                │   ├── MergeButton.tsx
                │   ├── CommentEditor.tsx
                │   ├── PullRequestAPI.ts
                │   ├── PullRequestStore.ts
                │   ├── PullRequestHooks.ts
                │   ├── PullRequestStyles.css
                │   └── index.ts
                │
                ├── Reviews/
                │   ├── ReviewsApp.tsx
                │   ├── ReviewsWindow.tsx
                │   ├── Pending.tsx
                │   ├── Approved.tsx
                │   ├── ChangesRequested.tsx
                │   ├── ReviewQueue.tsx
                │   ├── ReviewerLoad.tsx
                │   ├── ReviewTimeline.tsx
                │   ├── SuggestedReplies.tsx
                │   ├── ResolveThreads.tsx
                │   ├── CommentEditor.tsx
                │   ├── ReviewActions.tsx
                │   ├── ReviewsAPI.ts
                │   ├── ReviewsStore.ts
                │   ├── ReviewsHooks.ts
                │   ├── ReviewsStyles.css
                │   └── index.ts
                │
                ├── Issues/
                │   ├── IssuesApp.tsx
                │   ├── IssuesWindow.tsx
                │   ├── OpenIssues.tsx
                │   ├── ClosedIssues.tsx
                │   ├── Labels.tsx
                │   ├── Milestones.tsx
                │   ├── Assignees.tsx
                │   ├── Timeline.tsx
                │   ├── RelatedPullRequests.tsx
                │   ├── DuplicateDetector.tsx
                │   ├── CreateIssue.tsx
                │   ├── CommentEditor.tsx
                │   ├── IssueActions.tsx
                │   ├── IssuesAPI.ts
                │   ├── IssuesStore.ts
                │   ├── IssuesHooks.ts
                │   ├── IssuesStyles.css
                │   └── index.ts
                │
                ├── Insights/
                │   ├── InsightsApp.tsx
                │   ├── InsightsWindow.tsx
                │   ├── ReviewHealth.tsx
                │   ├── MergeWithoutReview.tsx
                │   ├── BusFactor.tsx
                │   ├── CommitDecay.tsx
                │   ├── ActivityScore.tsx
                │   ├── RepositoryHealth.tsx
                │   ├── ReleaseRisk.tsx
                │   ├── OwnershipMap.tsx
                │   ├── ReviewerGap.tsx
                │   ├── IssueGraveyard.tsx
                │   ├── WeekendHeatmap.tsx
                │   ├── TrendExplorer.tsx
                │   ├── InsightsAPI.ts
                │   ├── InsightsStore.ts
                │   ├── InsightsHooks.ts
                │   ├── InsightsStyles.css
                │   └── index.ts
                │
                ├── Team/
                │   ├── TeamApp.tsx
                │   ├── TeamWindow.tsx
                │   ├── Members.tsx
                │   ├── Leaderboard.tsx
                │   ├── ReviewerLoad.tsx
                │   ├── BusFactor.tsx
                │   ├── Contribution.tsx
                │   ├── Workload.tsx
                │   ├── Availability.tsx
                │   ├── TeamCalendar.tsx
                │   ├── TeamInsights.tsx
                │   ├── TeamAPI.ts
                │   ├── TeamStore.ts
                │   ├── TeamHooks.ts
                │   ├── TeamStyles.css
                │   └── index.ts
                │
                ├── Reports/
                │   ├── ReportsApp.tsx
                │   ├── ReportsWindow.tsx
                │   ├── Weekly.tsx
                │   ├── Monthly.tsx
                │   ├── Quarterly.tsx
                │   ├── CustomReport.tsx
                │   ├── ExportPDF.tsx
                │   ├── ExportCSV.tsx
                │   ├── ExportMarkdown.tsx
                │   ├── Snapshot.tsx
                │   ├── ShareReport.tsx
                │   ├── ReportsAPI.ts
                │   ├── ReportsStore.ts
                │   ├── ReportsHooks.ts
                │   ├── ReportsStyles.css
                │   └── index.ts
                │
                ├── Heatmap/
                │   ├── HeatmapApp.tsx
                │   ├── HeatmapWindow.tsx
                │   ├── CommitHeatmap.tsx
                │   ├── ReviewHeatmap.tsx
                │   ├── ActivityHeatmap.tsx
                │   ├── WeekendHeatmap.tsx
                │   ├── OwnershipHeatmap.tsx
                │   ├── HeatmapFilters.tsx
                │   ├── HeatmapAPI.ts
                │   ├── HeatmapStore.ts
                │   ├── HeatmapHooks.ts
                │   ├── HeatmapStyles.css
                │   └── index.ts
                │
                ├── Activity/
                │   ├── ActivityApp.tsx
                │   ├── ActivityWindow.tsx
                │   ├── LiveFeed.tsx
                │   ├── Timeline.tsx
                │   ├── Events.tsx
                │   ├── Filters.tsx
                │   ├── Notifications.tsx
                │   ├── RepositoryFeed.tsx
                │   ├── TeamFeed.tsx
                │   ├── ActivityAPI.ts
                │   ├── ActivityStore.ts
                │   ├── ActivityHooks.ts
                │   ├── ActivityStyles.css
                │   └── index.ts
                │
                ├── Search/
                │   ├── SearchApp.tsx
                │   ├── SearchWindow.tsx
                │   ├── GlobalSearch.tsx
                │   ├── RepositoryResults.tsx
                │   ├── PullRequestResults.tsx
                │   ├── ReviewResults.tsx
                │   ├── IssueResults.tsx
                │   ├── CommitResults.tsx
                │   ├── ContributorResults.tsx
                │   ├── SavedSearches.tsx
                │   ├── SearchAPI.ts
                │   ├── SearchStore.ts
                │   ├── SearchHooks.ts
                │   ├── SearchStyles.css
                │   └── index.ts
                │
                ├── Terminal/
                │   ├── TerminalApp.tsx
                │   ├── TerminalWindow.tsx
                │   ├── Console.tsx
                │   ├── Commands.ts
                │   ├── Prompt.tsx
                │   ├── History.ts
                │   ├── AutoComplete.ts
                │   ├── TerminalAPI.ts
                │   ├── TerminalStore.ts
                │   ├── TerminalHooks.ts
                │   ├── TerminalStyles.css
                │   └── index.ts
                │
                ├── Workflow/
                │   ├── WorkflowApp.tsx
                │   ├── WorkflowWindow.tsx
                │   ├── Inbox.tsx
                │   ├── MyTasks.tsx
                │   ├── WaitingReview.tsx
                │   ├── ReadyToMerge.tsx
                │   ├── Blocked.tsx
                │   ├── Drafts.tsx
                │   ├── RecentlyUpdated.tsx
                │   ├── SuggestedNextAction.tsx
                │   ├── SmartQueue.tsx
                │   ├── PriorityEngine.tsx
                │   ├── WorkflowTimeline.tsx
                │   ├── WorkflowAPI.ts
                │   ├── WorkflowStore.ts
                │   ├── WorkflowHooks.ts
                │   ├── WorkflowStyles.css
                │   └── index.ts
                │
                ├── ReleaseCenter/
                │   ├── ReleaseCenterApp.tsx
                │   ├── ReleaseCenterWindow.tsx
                │   ├── DraftRelease.tsx
                │   ├── ReleaseHistory.tsx
                │   ├── ReleaseChecklist.tsx
                │   ├── Changelog.tsx
                │   ├── Assets.tsx
                │   ├── Rollback.tsx
                │   ├── ReleaseNotes.tsx
                │   ├── ReleaseRisk.tsx
                │   ├── PublishButton.tsx
                │   ├── ReleaseAPI.ts
                │   ├── ReleaseStore.ts
                │   ├── ReleaseHooks.ts
                │   ├── ReleaseStyles.css
                │   └── index.ts
                │
                ├── Projects/
                │   ├── ProjectsApp.tsx
                │   ├── ProjectsWindow.tsx
                │   ├── Boards.tsx
                │   ├── Backlog.tsx
                │   ├── Sprint.tsx
                │   ├── Kanban.tsx
                │   ├── Roadmap.tsx
                │   ├── Milestones.tsx
                │   ├── Priorities.tsx
                │   ├── Dependencies.tsx
                │   ├── ProjectCalendar.tsx
                │   ├── ProjectAPI.ts
                │   ├── ProjectStore.ts
                │   ├── ProjectHooks.ts
                │   ├── ProjectStyles.css
                │   └── index.ts
                │
                ├── Automation/
                │   ├── AutomationApp.tsx
                │   ├── AutomationWindow.tsx
                │   ├── Rules.tsx
                │   ├── Triggers.tsx
                │   ├── Conditions.tsx
                │   ├── Actions.tsx
                │   ├── Templates.tsx
                │   ├── Scheduler.tsx
                │   ├── Executions.tsx
                │   ├── History.tsx
                │   ├── AutomationAPI.ts
                │   ├── AutomationStore.ts
                │   ├── AutomationHooks.ts
                │   ├── AutomationStyles.css
                │   └── index.ts
                │
                ├── CodeExplorer/
                │   ├── CodeExplorerApp.tsx
                │   ├── CodeExplorerWindow.tsx
                │   ├── RepositoryTree.tsx
                │   ├── FileViewer.tsx
                │   ├── MarkdownViewer.tsx
                │   ├── ImageViewer.tsx
                │   ├── CommitHistory.tsx
                │   ├── FileHistory.tsx
                │   ├── BlameView.tsx
                │   ├── CompareFiles.tsx
                │   ├── SearchInRepository.tsx
                │   ├── CodeExplorerAPI.ts
                │   ├── CodeExplorerStore.ts
                │   ├── CodeExplorerHooks.ts
                │   ├── CodeExplorerStyles.css
                │   └── index.ts
                │
                ├── NotificationCenter/
                │   ├── NotificationCenterApp.tsx
                │   ├── NotificationCenterWindow.tsx
                │   ├── Inbox.tsx
                │   ├── PullRequests.tsx
                │   ├── Reviews.tsx
                │   ├── Issues.tsx
                │   ├── Releases.tsx
                │   ├── Mentions.tsx
                │   ├── Team.tsx
                │   ├── Activity.tsx
                │   ├── NotificationFilters.tsx
                │   ├── NotificationAPI.ts
                │   ├── NotificationStore.ts
                │   ├── NotificationHooks.ts
                │   ├── NotificationStyles.css
                │   └── index.ts
                │
                ├── WorkspaceManager/
                │   ├── WorkspaceManagerApp.tsx
                │   ├── WorkspaceWindow.tsx
                │   ├── SavedWorkspaces.tsx
                │   ├── Templates.tsx
                │   ├── Sessions.tsx
                │   ├── Favorites.tsx
                │   ├── Recent.tsx
                │   ├── ImportWorkspace.tsx
                │   ├── ExportWorkspace.tsx
                │   ├── WorkspacePreview.tsx
                │   ├── WorkspaceAPI.ts
                │   ├── WorkspaceStore.ts
                │   ├── WorkspaceHooks.ts
                │   ├── WorkspaceStyles.css
                │   └── index.ts
                │
                ├── CommandCenter/
                │   ├── CommandCenterApp.tsx
                │   ├── CommandCenterWindow.tsx
                │   ├── QuickCommands.tsx
                │   ├── FavoriteCommands.tsx
                │   ├── RecentCommands.tsx
                │   ├── RepositoryCommands.tsx
                │   ├── PullRequestCommands.tsx
                │   ├── IssueCommands.tsx
                │   ├── ReleaseCommands.tsx
                │   ├── AutomationCommands.tsx
                │   ├── CommandCenterAPI.ts
                │   ├── CommandCenterStore.ts
                │   ├── CommandCenterHooks.ts
                │   ├── CommandCenterStyles.css
                │   └── index.ts
                │
                ├── TeamHub/
                │   ├── TeamHubApp.tsx
                │   ├── TeamHubWindow.tsx
                │   ├── Members.tsx
                │   ├── OnlineNow.tsx
                │   ├── Availability.tsx
                │   ├── Assignments.tsx
                │   ├── Leaderboard.tsx
                │   ├── Calendar.tsx
                │   ├── TeamActivity.tsx
                │   ├── Discussions.tsx
                │   ├── TeamHubAPI.ts
                │   ├── TeamHubStore.ts
                │   ├── TeamHubHooks.ts
                │   ├── TeamHubStyles.css
                │   └── index.ts
                │
                ├── SystemMonitor/
                │   ├── SystemMonitorApp.tsx
                │   ├── SystemMonitorWindow.tsx
                │   ├── GitHubAPI.tsx
                │   ├── Websocket.tsx
                │   ├── Database.tsx
                │   ├── Cache.tsx
                │   ├── Queue.tsx
                │   ├── BackgroundJobs.tsx
                │   ├── Logs.tsx
                │   ├── Performance.tsx
                │   ├── SystemMonitorAPI.ts
                │   ├── SystemMonitorStore.ts
                │   ├── SystemMonitorHooks.ts
                │   ├── SystemMonitorStyles.css
                │   └── index.ts
                │
                ├── Store/
                │   ├── StoreApp.tsx
                │   ├── StoreWindow.tsx
                │   ├── Featured.tsx
                │   ├── Categories.tsx
                │   ├── Installed.tsx
                │   ├── Updates.tsx
                │   ├── Search.tsx
                │   ├── Details.tsx
                │   ├── Install.tsx
                │   ├── Uninstall.tsx
                │   ├── StoreAPI.ts
                │   ├── StoreStore.ts
                │   ├── StoreHooks.ts
                │   ├── StoreStyles.css
                │   └── index.ts
                │
                └── Settings/
                    ├── SettingsApp.tsx
                    ├── SettingsWindow.tsx
                    ├── Appearance.tsx
                    ├── Sounds.tsx
                    ├── Themes.tsx
                    ├── Workspace.tsx
                    ├── Keyboard.tsx
                    ├── Integrations.tsx
                    ├── Notifications.tsx
                    ├── About.tsx
                    ├── SettingsStore.ts
                    ├── SettingsHooks.ts
                    ├── SettingsStyles.css
                    └── index.ts
```

---

## Total Applications Desktop (21)

Dashboard · Repository · Pull Requests · Reviews · Issues · Insights · Workflow · Projects · Automation · Release Center · Search · Activity · Reports · Heatmap · Notification Center · Workspace Manager · Command Center · Team Hub · System Monitor · Terminal · Store · Settings

---

## Ringkasan Arsitektur (dari Part 5)

```
──────────────────────────────────────
Desktop Layer      → Applications, Workspace, Taskbar, Window Manager
──────────────────────────────────────
Workflow Layer     → Automation, Priority Engine, Recommendations
──────────────────────────────────────
Action Layer       → Approve, Merge, Assign, Comment, Create
──────────────────────────────────────
Analytics Layer    → Scoring, Insights, Reports, Heatmaps
──────────────────────────────────────
Data Layer         → Webhook, Database, GitHub API
──────────────────────────────────────
```

Filosofi:
```
GitHub → Data → Analytics → Workflow → Actions → Desktop → Engineering Workstation
```

## User / System Flow Utama

```
User → Landing → GitHub OAuth → Repository Authorization → Permission Check
     → Boot Sequence → Load Workspace → Desktop → Restore Windows
     → Realtime Sync → Engineering Work
```

## Roadmap v3 (belum dibuat, catatan arah selanjutnya)

- Plugin SDK (orang lain bisa bikin aplikasi untuk ONYX)
- Extension Marketplace
- Multi-provider (GitHub, GitLab, Bitbucket, Azure DevOps dalam satu desktop)
- Offline Mode + Sync Engine
- Local Repository Integration (integrasi langsung dengan Git lokal, bukan hanya GitHub API)

> Evolusi: **GitHub Viewer → GitHub Workstation → Engineering Operating System**
