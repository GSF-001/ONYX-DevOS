#!/data/data/com.termux/files/usr/bin/bash

create_icon () {
cat > "$1.svg" <<SVG
$2
SVG
}

create_icon dashboard '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<rect x="5" y="7" width="38" height="30" rx="7" fill="#111827" stroke="#38BDF8" stroke-width="2"/>
<rect x="10" y="12" width="28" height="18" rx="3" fill="#020617"/>
<path d="M13 25L19 19L24 23L34 15" stroke="#22D3EE" stroke-width="3"/>
<circle cx="34" cy="15" r="2" fill="#22D3EE"/>
</svg>'

create_icon repository '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<rect x="7" y="9" width="34" height="30" rx="6" fill="#111827" stroke="#34D399" stroke-width="2"/>
<circle cx="18" cy="18" r="4" fill="#34D399"/>
<circle cx="30" cy="30" r="4" fill="#34D399"/>
<path d="M21 20L27 27M18 22V34" stroke="#34D399" stroke-width="3"/>
</svg>'

create_icon pull_requests '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<circle cx="14" cy="14" r="5" fill="#38BDF8"/>
<circle cx="34" cy="34" r="5" fill="#38BDF8"/>
<path d="M14 19V35M14 35C25 35 34 27 34 18V14" stroke="#38BDF8" stroke-width="3"/>
<path d="M29 19L34 14L39 19" stroke="#22D3EE" stroke-width="3"/>
</svg>'

create_icon reviews '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<rect x="10" y="7" width="28" height="34" rx="5" fill="#111827" stroke="#A78BFA" stroke-width="2"/>
<path d="M16 18H32M16 24H28" stroke="#A78BFA" stroke-width="3"/>
<path d="M17 32L22 36L32 26" stroke="#34D399" stroke-width="3"/>
</svg>'

create_icon issues '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<path d="M24 6L44 40H4L24 6Z" fill="#111827" stroke="#F59E0B" stroke-width="3"/>
<path d="M24 18V27" stroke="#F59E0B" stroke-width="3"/>
<circle cx="24" cy="33" r="2" fill="#F59E0B"/>
</svg>'

create_icon insights '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<rect x="7" y="7" width="34" height="34" rx="7" fill="#020617" stroke="#22D3EE" stroke-width="2"/>
<path d="M14 32L21 24L27 28L36 15" stroke="#22D3EE" stroke-width="3"/>
</svg>'

create_icon team '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<circle cx="18" cy="18" r="6" fill="#34D399"/>
<circle cx="32" cy="20" r="5" fill="#38BDF8"/>
<path d="M8 38C8 29 28 29 28 38M27 38C27 32 40 32 40 38" stroke="#34D399" stroke-width="3"/>
</svg>'

create_icon reports '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<rect x="9" y="7" width="30" height="34" rx="5" fill="#111827" stroke="#38BDF8" stroke-width="2"/>
<path d="M16 18H32M16 25H32M16 32H26" stroke="#38BDF8" stroke-width="3"/>
</svg>'

create_icon heatmap '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<rect x="8" y="8" width="10" height="10" fill="#22D3EE"/>
<rect x="21" y="8" width="10" height="10" fill="#34D399"/>
<rect x="34" y="8" width="6" height="10" fill="#A78BFA"/>
<rect x="8" y="21" width="10" height="10" fill="#34D399"/>
<rect x="21" y="21" width="10" height="10" fill="#38BDF8"/>
<rect x="34" y="21" width="6" height="10" fill="#F59E0B"/>
</svg>'

create_icon activity '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<path d="M6 26H15L20 14L28 34L33 22H42" stroke="#22D3EE" stroke-width="3"/>
</svg>'

create_icon terminal '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<rect x="6" y="8" width="36" height="32" rx="7" fill="#020617" stroke="#22D3EE" stroke-width="2"/>
<path d="M14 19L22 24L14 29" stroke="#22D3EE" stroke-width="3"/>
<rect x="25" y="29" width="10" height="3" fill="#22D3EE"/>
</svg>'

create_icon settings '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<circle cx="24" cy="24" r="10" fill="#A78BFA"/>
<path d="M24 5V12M24 36V43M5 24H12M36 24H43" stroke="#A78BFA" stroke-width="4"/>
</svg>'

create_icon profile '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<circle cx="24" cy="17" r="8" fill="#38BDF8"/>
<path d="M10 41C10 31 38 31 38 41" stroke="#38BDF8" stroke-width="3"/>
</svg>'

create_icon gitgraph '
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
<circle cx="12" cy="12" r="5" fill="#34D399"/>
<circle cx="36" cy="24" r="5" fill="#38BDF8"/>
<circle cx="12" cy="36" r="5" fill="#A78BFA"/>
<path d="M17 12H25C32 12 31 24 31 24M17 36H25C32 36 31 24 31 24" stroke="#22D3EE" stroke-width="3"/>
</svg>'

