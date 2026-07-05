# Integrasi Module ONYX ke dalam `trace/`

Mengikuti pattern yang sudah ada di `apps/web/src/applications/*` dan `apps/server/src/*`.

```
trace/
└── apps/
    ├── server/
    │   └── src/
    │       ├── auth/
    │       │   ├── githubOAuth.ts
    │       │   ├── session.ts
    │       │   ├── ...(existing)
    │       │   ├── identity.ts              ⭐ BARU (generate ONYX://NAME anonim, cooldown 30 hari)
    │       │   └── index.ts
    │       │
    │       ├── bounties/                    ⭐ BARU
    │       │   ├── list.ts                 (Discover/Trending/Categories/Saved/History)
    │       │   ├── sources.ts               (GitHub, GitLab, Codeberg, Forgejo)
    │       │   ├── create.ts
    │       │   ├── apply.ts
    │       │   ├── reward.ts               (payout logic $250, $180, dst)
    │       │   ├── difficulty.ts
    │       │   └── index.ts
    │       │
    │       ├── community/                  ⭐ BARU
    │       │   ├── feed.ts
    │       │   ├── trending.ts
    │       │   ├── projects.ts
    │       │   ├── developers.ts
    │       │   ├── discussions.ts
    │       │   ├── events.ts
    │       │   ├── showcase.ts
    │       │   └── index.ts
    │       │
    │       ├── groups/                     ⭐ BARU
    │       │   ├── publicGroups.ts
    │       │   ├── privateGroups.ts
    │       │   ├── anonymousGroups.ts       (ONYX://CORE, ONYX://BUILDERS, dst)
    │       │   ├── membership.ts
    │       │   ├── chat.ts                  (pasangan websocket/rooms.ts)
    │       │   └── index.ts
    │       │
    │       ├── marketplace/                ⭐ BARU
    │       │   ├── list.ts                  (Featured/Trending/New/Categories)
    │       │   ├── install.ts
    │       │   ├── search.ts
    │       │   ├── manifestValidator.ts     (baca manifest.json plugin)
    │       │   └── index.ts
    │       │
    │       ├── plugin-system/               ⭐ BARU (core plugin engine, dipakai marketplace + plugins app)
    │       │   ├── PluginManager.ts
    │       │   ├── PluginRegistry.ts
    │       │   ├── PluginLoader.ts
    │       │   ├── PluginInstaller.ts
    │       │   ├── PluginUpdater.ts
    │       │   ├── PluginUninstaller.ts
    │       │   ├── PluginValidator.ts
    │       │   ├── PluginPermissions.ts
    │       │   ├── PluginSandbox.ts
    │       │   └── index.ts
    │       │
    │       ├── reputation/                 ⭐ BARU
    │       │   ├── contributionScore.ts
    │       │   ├── reviewScore.ts
    │       │   ├── pluginScore.ts
    │       │   ├── bountyScore.ts
    │       │   ├── trustScore.ts
    │       │   ├── totalReputation.ts
    │       │   └── index.ts
    │       │
    │       ├── webhook/ ...(existing, tidak berubah)
    │       ├── websocket/
    │       │   ├── ...(existing)
    │       │   ├── communityFeed.ts        ⭐ BARU
    │       │   ├── groupChat.ts            ⭐ BARU
    │       │   └── bountyUpdates.ts        ⭐ BARU
    │       │
    │       ├── db/
    │       │   ├── schema.ts               (tambah tabel: bounties, groups, group_members,
    │       │   │                            community_posts, plugins, plugin_installs,
    │       │   │                            identities, reputation_scores)
    │       │   └── ...(existing)
    │       │
    │       ├── scoring/ ...(existing, tidak berubah)
    │       ├── services/ ...(existing, tidak berubah)
    │       │
    │       ├── routes/
    │       │   ├── ...(existing)
    │       │   ├── bounties.ts             ⭐ BARU
    │       │   ├── community.ts            ⭐ BARU
    │       │   ├── groups.ts               ⭐ BARU
    │       │   ├── marketplace.ts          ⭐ BARU
    │       │   ├── plugins.ts              ⭐ BARU
    │       │   ├── identity.ts             ⭐ BARU
    │       │   └── index.ts
    │       │
    │       └── index.ts
    │
    └── web/
        └── src/
            ├── ...(App.tsx, main.tsx, router.tsx, index.css — tidak berubah)
            │
            ├── identity/                    ⭐ BARU (screen "Choose Your ONYX Identity")
            │   ├── IdentityPicker.tsx       (list ONYX://PIXEL, ONYX://NOVA, dst)
            │   ├── IdentityPreview.tsx      (avatar + Developer ID)
            │   ├── GenerateIdentityButton.tsx
            │   ├── ConfirmIdentity.tsx
            │   ├── IdentityCooldown.ts      (1x ganti / 30 hari)
            │   ├── IdentityStore.ts
            │   ├── IdentityAPI.ts
            │   └── index.ts
            │
            ├── window-manager/ ...(existing, tidak berubah — semua app baru pakai WindowFrame yang sama)
            │
            └── applications/
                ├── ...(Dashboard, Repository, PullRequests, Reviews, Issues,
                │       Insights, Team, Reports, Heatmap, Activity, Terminal,
                │       Settings — existing, tidak berubah)
                │
                ├── Bounties/                ⭐ BARU
                │   ├── BountiesApp.tsx
                │   ├── BountiesWindow.tsx
                │   ├── Discover.tsx
                │   ├── Trending.tsx
                │   ├── Categories.tsx
                │   ├── Saved.tsx
                │   ├── History.tsx
                │   ├── BountyCard.tsx
                │   ├── BountyDetail.tsx     (preview: reward, deadline, difficulty, skills)
                │   ├── ApplyBountyButton.tsx
                │   ├── SourceFilter.tsx     (GitHub/GitLab/Codeberg/Forgejo)
                │   ├── BountiesAPI.ts
                │   ├── BountiesStore.ts
                │   ├── BountiesTypes.ts
                │   ├── BountiesHooks.ts
                │   ├── BountiesStyles.css
                │   └── index.ts
                │
                ├── Community/               ⭐ BARU
                │   ├── CommunityApp.tsx
                │   ├── CommunityWindow.tsx
                │   ├── Feed.tsx
                │   ├── Trending.tsx
                │   ├── Explore.tsx
                │   ├── Projects.tsx
                │   ├── Developers.tsx
                │   ├── Discussions.tsx
                │   ├── Events.tsx
                │   ├── Showcase.tsx
                │   ├── FeedPost.tsx         (avatar identity + like/comment count)
                │   ├── CommunityAPI.ts
                │   ├── CommunityStore.ts
                │   ├── CommunityTypes.ts
                │   ├── CommunityHooks.ts
                │   ├── CommunityStyles.css
                │   └── index.ts
                │
                ├── Groups/                  ⭐ BARU
                │   ├── GroupsApp.tsx
                │   ├── GroupsWindow.tsx
                │   ├── PublicGroups.tsx
                │   ├── PrivateGroups.tsx
                │   ├── AnonymousGroups.tsx  (list ONYX://CORE, ONYX://BUILDERS, dst + Members count)
                │   ├── MyGroups.tsx
                │   ├── CreateGroup.tsx
                │   ├── JoinGroupButton.tsx
                │   ├── GroupChat.tsx        (pasangan Chat (Groups) di gambar 1)
                │   ├── ChatMessage.tsx
                │   ├── MemberList.tsx
                │   ├── GroupsAPI.ts
                │   ├── GroupsStore.ts
                │   ├── GroupsTypes.ts
                │   ├── GroupsHooks.ts
                │   ├── GroupsStyles.css
                │   └── index.ts
                │
                ├── Marketplace/             ⭐ BARU
                │   ├── MarketplaceApp.tsx
                │   ├── MarketplaceWindow.tsx
                │   ├── Home.tsx
                │   ├── Featured.tsx
                │   ├── Trending.tsx
                │   ├── New.tsx
                │   ├── Categories.tsx
                │   ├── Search.tsx
                │   ├── Installed.tsx
                │   ├── Updates.tsx
                │   ├── PluginCard.tsx       (Docker Monitor, GitHub Bounties, Weather Widget, dst)
                │   ├── InstallButton.tsx
                │   ├── MarketplaceAPI.ts
                │   ├── MarketplaceStore.ts
                │   ├── MarketplaceTypes.ts
                │   ├── MarketplaceHooks.ts
                │   ├── MarketplaceStyles.css
                │   └── index.ts
                │
                ├── Plugins/                 ⭐ BARU (manager plugin yang sudah terinstall)
                │   ├── PluginsApp.tsx
                │   ├── PluginsWindow.tsx
                │   ├── Installed.tsx
                │   ├── Updates.tsx
                │   ├── Permissions.tsx
                │   ├── Logs.tsx
                │   ├── DeveloperMode.tsx
                │   ├── PluginRow.tsx        (Enable/Disable/Uninstall)
                │   ├── PluginsAPI.ts
                │   ├── PluginsStore.ts
                │   ├── PluginsTypes.ts
                │   ├── PluginsHooks.ts
                │   ├── PluginsStyles.css
                │   └── index.ts
                │
                ├── Explorer/                ⭐ BARU (file/workspace browser, mirip Windows Explorer)
                │   ├── ExplorerApp.tsx
                │   ├── ExplorerWindow.tsx
                │   ├── Files.tsx
                │   ├── Recent.tsx
                │   ├── Favorites.tsx
                │   ├── Downloads.tsx
                │   ├── WorkspaceFolder.tsx
                │   ├── RepositoryFolder.tsx
                │   ├── PluginFolder.tsx
                │   ├── Search.tsx
                │   ├── AddressBar.tsx
                │   ├── Toolbar.tsx          (Back/Up/Cut/Copy/Paste/Delete)
                │   ├── ExplorerAPI.ts
                │   ├── ExplorerStore.ts
                │   ├── ExplorerTypes.ts
                │   ├── ExplorerHooks.ts
                │   ├── ExplorerStyles.css
                │   └── index.ts
                │
                └── Profile/                 ⭐ BARU
                    ├── ProfileApp.tsx
                    ├── ProfileWindow.tsx
                    ├── Overview.tsx         (identity avatar, Developer ID, Member since)
                    ├── ReputationPanel.tsx  (Contribution/Review/Plugin/Bounty/Trust/Total Score)
                    ├── Achievements.tsx
                    ├── Badges.tsx
                    ├── Contributions.tsx
                    ├── Bounties.tsx         (Bounties Completed)
                    ├── PluginsPublished.tsx
                    ├── Repositories.tsx     (Repositories Connected)
                    ├── Followers.tsx
                    ├── Following.tsx
                    ├── Settings.tsx
                    ├── ProfileAPI.ts
                    ├── ProfileStore.ts
                    ├── ProfileTypes.ts
                    ├── ProfileHooks.ts
                    ├── ProfileStyles.css
                    └── index.ts
```

## Catatan integrasi

1. **Shared components yang perlu ditambah** di `shared/components/`:
   `ReputationBadge.tsx`, `IdentityAvatar.tsx` (dipakai di Community, Groups, Profile, Terminal), `PluginCard.tsx` (dipakai Marketplace + Plugins).
2. **Taskbar**: tambah 5 icon baru (Bounties, Community, Groups, Marketplace, Explorer) di `taskbar/QuickLaunch.tsx`, sama seperti icon existing di gambar 1 bagian bawah ("DESKTOP PREVIEW").
3. **Terminal**: tambah command baru di `terminal/TerminalCommands.ts` — `onyx plugin list`, `onyx --version`.
4. **Auth flow**: `identity/` jalan setelah OAuth GitHub sukses, sebelum masuk `desktop/` — mirip flow "Choose Your ONYX Identity" di gambar 1.
5. **Urutan pengerjaan** (dari roadmap gambar 2): Community → Groups → Bounties → Plugin System (SDK) → Marketplace → Explorer → Profile. Semua opsional, tidak mengubah struktur core yang sudah ada.
