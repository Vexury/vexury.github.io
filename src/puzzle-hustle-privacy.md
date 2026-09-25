---
layout: base.html
title: Puzzle Hustle Privacy Policy
---

# Puzzle Hustle Privacy Policy

<p class="post-date">Last updated: September 25, 2026</p>

This policy covers the Puzzle Hustle app for Android and iOS, and the web version at
[puzzles.vexury.dev](https://puzzles.vexury.dev/). For the rest of this website, see the
[Datenschutzerklärung](/datenschutz/).

## The short version

You can play every puzzle without an account, and there are no analytics and no crash reporting.
Your progress, streaks, coins and settings stay on your device.

Signing in is optional and only unlocks the social part: private groups where friends compare
their Daily, Weekly and Monthly times. If you sign in, our server keeps an account ID from Google
or Apple, your display name, the badge and flair you show, your groups and the times you submit.
It never stores your email address. You can delete the account in the app at any time.

The Android and iOS apps show rewarded video ads, which you only ever see after choosing to watch
one in exchange for a hint. Those ads come from Google. The web version has no ads.

## Who is responsible

Moritz Grauer (Vexury)
Klara-Siebert-Straße 17
76137 Karlsruhe, Germany
vexury.dev@gmail.com

## What the app stores, and where

The app saves the following on your device:

- which puzzles you have solved, with time, moves and hints used
- your streak, the days you have played and your achievements
- your coins, the badges you bought and the flairs you earned
- unfinished puzzles, so you can pick them up where you left off
- settings such as the theme, your display name and your last chosen difficulty
- if you are signed in, your session and any times still waiting to be sent

On Android and iOS this lives in the app's local storage and in a backup copy in the app's own
private preferences, so that clearing the app cache does not wipe your progress. If you have
device backups switched on, Android or iOS may include this data in your Google or iCloud backup;
that is between you and Google or Apple. We cannot see any of it, and we cannot restore it for
you. Uninstalling the app deletes it from the device.

The Profile screen has a reset button that erases your progress on the device on the spot. It does
not touch your account or the times you have already submitted; deleting the account does that.

## Signing in

Signing in is optional. Without it every puzzle, level, hint and achievement works exactly the
same. Only the Social tab needs an account.

- On Android and on the web you sign in with **Google**. On the web, Google's sign-in script is
  only loaded once you tap Sign in.
- On iOS you sign in with **Apple**. The app asks Apple for neither your name nor your email
  address.

Google or Apple hands the app a signed token, which our server checks. From it the server keeps
only the account identifier the provider issues for this app (the provider's "subject" ID) and
which provider it came from. A Google token can also carry your email address and name; the server
reads neither and stores neither. The provider learns that you signed in to Puzzle Hustle, under
its own privacy policy ([Google](https://policies.google.com/privacy),
[Apple](https://www.apple.com/legal/privacy/)).

Your session stays valid for 30 days and renews itself while you play. Signing out ends it on the
device.

## What our server keeps

The server exists only for groups and standings. Solving never waits for it, and no puzzle comes
from it. If you are signed in, it stores:

- **Account:** a random player ID, the provider (Google or Apple) with its subject ID, and when
  the account was created.
- **Display name:** the name you choose, or a generated one such as "Player 4821" until you do.
  Names are 2 to 24 characters, may not contain links, and a short list of offensive words is
  refused.
- **Badge and flair:** the one badge and one flair you have equipped, as IDs from the app's fixed
  list. Your coins and what you own stay on your device.
- **Groups:** the groups you created or joined, their names and six-character invite codes, and
  when you joined. A player can be in at most 5 groups, and a group holds at most 50 players.
- **Times:** for each Daily, Weekly and Monthly puzzle you solve while signed in, your time, hints,
  moves and when you solved it. Times you solved shortly before signing in are sent once you do.
  Level and random puzzles are never sent.
- **Reports:** when you report a name, who reported whom, the reason and when.

Other members of a group you are in see your display name, badge, flair, and your time and hints
for each Daily, Weekly and Monthly. Nobody outside your groups sees your name. The standings also
show how you did against everyone who solved the same puzzle, as an anonymous count.

The data stays on the server for as long as your account exists. There is no automatic expiry.

### Reports and moderation

Every name in the standings has a report button. There is no automatic ban. We read reports by
hand, and a name that breaks the rules above may be replaced with a generated one, or an account
used for abuse deleted. A group's creator can remove members from it, and anyone can leave a group
at any time.

### Cloudflare

The server is a Cloudflare Worker with a Cloudflare D1 database, run by Cloudflare, Inc., 101
Townsend St, San Francisco, CA 94107, USA, which processes the data on our behalf under its data
processing addendum. To answer requests and protect the service, Cloudflare processes technical
data such as your IP address; the sign-in endpoint uses it to limit how often one address can
try. We do not store IP addresses. Cloudflare may process data outside the European Union; it is
certified under the EU-U.S. Data Privacy Framework, and its data processing addendum includes the
EU Standard Contractual Clauses. See the
[Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/).

### Deleting your account

In the app, open Profile, tap **Delete account** and confirm. On iOS, Apple's sign-in sheet opens
once more so that the app can also revoke Puzzle Hustle's access to your Apple ID; if you close the
sheet, nothing is deleted. A Google account can be deleted the same way in the web version at
[puzzles.vexury.dev](https://puzzles.vexury.dev/) after signing in, without installing anything.

Deleting removes your account, display name, badge, flair, all your submitted times, every report
you made or that was made about you, and your group memberships, right away. A group you created
passes to its longest-standing member, or is deleted if you were the last one in it. Your progress
on the device is not affected.

If you cannot use the app, write to vexury.dev@gmail.com with your display name and the name of a
group you are in, and we will delete the account for you.

## Ads

Every puzzle gives you one hint for free. Beyond that a hint costs a short video or some of your
coins, and the app asks first: the video only starts if you tap "Watch video". Declining costs you
nothing, and if no ad can be delivered you get the hint anyway.

The ads are served by Google AdMob (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
Ireland). To show and measure them, Google processes your device's **advertising ID** along with
technical data such as your device type, operating system version, coarse location derived from
your IP address, and how you interacted with the ad. We never receive any of it, and we cannot
link it to you or to your Puzzle Hustle account.

On iOS the app never shows Apple's tracking prompt, so Google's SDK does not get your iPhone's
advertising identifier (IDFA).

We do not use Google Analytics for Firebase, and AdMob's user metrics are switched off for this
app. Ads are limited to the "General" content rating, so nothing stronger than the app itself
should appear.

### Your choice, and how to change it

In the European Economic Area, the United Kingdom and Switzerland the app asks for your consent
before the first ad, using Google's User Messaging Platform. You can refuse, and refusing is
offered as plainly as agreeing. Refusing does not lock you out of anything: hints still work.

You can change your mind at any time through **Ad privacy settings** at the bottom of the Profile
screen, which reopens the same dialog.

Independently of that, Android lets you reset or delete your advertising ID under
Settings → Google → Ads.

The legal basis for personalised advertising is your consent, Art. 6(1)(a) GDPR, which you may
withdraw at any time with effect for the future. How Google handles the data is described in the
[Google Privacy Policy](https://policies.google.com/privacy) and in
[How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites).

## Unlimited Hints

The app offers one purchase, "Unlimited Hints", which removes the videos for good. On Android it
is handled entirely by Google Play, on iOS entirely by Apple's App Store. Your payment details go
to Google or Apple, never to us, and we never see your name, address or card.

At each start the app asks Google Play or the App Store whether this purchase exists for your
store account, and stores only that yes or no on your device. Our server keeps no record of who
bought anything. Refunds and payment questions go through Google Play or Apple.

Coins are earned by solving and cannot be bought.

## Network

The app generates every puzzle on your device from the current date, which is why everyone gets
the same daily puzzles without anything being transmitted. Puzzles, progress and settings work with
no connection at all.

It reaches the internet for these things, and only these:

- talking to our server, only while you are signed in: standings, groups, your name and badge,
  submitted times
- signing in with Google or Apple, when you choose to
- fetching an ad when you have asked for one
- asking Google Play or the App Store about the "Unlimited Hints" purchase

The web version has to be delivered to your browser, and that is done by GitHub Pages. Like any
web host, GitHub processes access data such as your IP address, the page requested and the time of
the request in order to serve the page and keep the service secure. We do not receive that data
and have no access to it. GitHub's own privacy statement covers it:
[docs.github.com/site-policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Sharing a result

When you share a result or a group invite, the app hands a short text and a link to your device's
share sheet. You choose which app receives it. We are not part of that and never see what you send
or who you send it to.

## Permissions

The Android build declares internet and network state access, the advertising ID permission that
the Google Mobile Ads SDK requires, and the billing permission for the purchase. Neither the
Android nor the iOS app requests any runtime permission: no camera, no microphone, no contacts, no
location, no photos, no tracking.

## Children

Puzzle Hustle is not directed at children under 13. We do not knowingly collect data from children,
and ads are limited to the "General" content rating.

## Your rights

Under the GDPR you have the right to access, correct, delete and port your data, to restrict or
object to its processing, and to complain to a supervisory authority.

If you never sign in, we hold nothing about you: everything the app saves sits on your device,
where the reset button in the Profile screen and uninstalling both clear it.

If you do sign in, the data listed under "What our server keeps" is processed to provide the
groups and standings you asked for (Art. 6(1)(b) GDPR). Handling reports and limiting sign-in
attempts serve our legitimate interest in a fair service that is safe from abuse (Art. 6(1)(f)
GDPR). You can change your name in the Profile screen, leave any group and delete the account
yourself as described above. For a copy of your data, or anything the app does not let you do
yourself, write to us.

What Google processes for advertising is in your hands too: withdraw consent through Ad privacy
settings in the app, or reset or delete the advertising ID in your Android settings. For requests
about data Google or Apple holds, they are the contact, through the links above.

Questions go to vexury.dev@gmail.com and get an answer.

## Changes

This policy will be updated when the app changes in a way that affects it.

- September 25, 2026: optional sign-in with Google and Apple, private groups and standings, our
  server on Cloudflare, reports, account deletion, the iOS app and purchases through the App
  Store.
- September 21, 2026: rewarded ads and the "Unlimited Hints" purchase.
